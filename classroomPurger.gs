function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Classroom Purger')
    .addItem('List Google Classrooms', 'listGoogleClassrooms')
    .addItem('Dry Run Actions', 'dryRunDelete')
    .addItem('Actually Run Actions or Delete', 'actuallyDelete')
    .addToUi();
}

// Main function to fetch Google Classroom data and populate the Google Sheet
function listGoogleClassrooms() {
  const sheetName = 'Classroom Info';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  // If the sheet doesn't exist, create it
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  } else {
    // Clear existing data
    sheet.clear();
  }

  // Set up headers
  const headers = ['Class Name', 'Class ID', 'Is Owner', 'Course State', 'Calendar ID', 'Drive Folder ID', 'Action'];
  sheet.appendRow(headers);

  // Fetch the list of courses where the user is a teacher
  const optionalArgs = {
    teacherId: 'me',
    courseStates: ['ACTIVE', 'ARCHIVED', 'DECLINED', 'PROVISIONED', 'SUSPENDED']
  };

  const courses = Classroom.Courses.list(optionalArgs).courses;

  //Gets your Google Classroom profile so that we can find out your userId. For some reason, the string literal 'me' doesn't work when determining whether you're the owner of the lcassroom or not.
  const me = Classroom.Courses.Teachers.get(courses[0].id, 'me')


  if (courses && courses.length > 0) {
    // Collect course data into an array
    let courseData = courses.map(course => {
      const isOwner = (course.ownerId == me.userId)
      return [course.name, course.id, isOwner, course.courseState, course.getCalendarId(), course.teacherFolder.id];
    });

    // Sort the course data by course state and then by class name in ascending order
    courseData.sort((a, b) => {
      if (a[3] < b[3]) return -1;
      if (a[3] > b[3]) return 1;
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });

    // Append sorted course data to the sheet
    courseData.forEach(row => {
      sheet.appendRow(row);
    });
  } else {
    sheet.appendRow(['No courses found']);
  }
}

// Function to archive Google Classrooms labelled 'a' or 'A' in the 'Action' column
function archiveClassrooms() {
  const sheetName = 'Classroom Info';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    console.log('Sheet not found!');
    return;
  }

  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  // Iterate over the rows, starting from the second row (index 1) to skip headers
  for (let i = 1; i < data.length; i++) {
    const action = data[i][6]; // 'Action' column
    const courseId = data[i][1]; // 'Class ID' column

    if (action.toLowerCase() === 'a') {
      try {
        Classroom.Courses.patch({courseState: 'ARCHIVED'}, courseId, {updateMask: 'courseState'});
        console.log(`Archived course: ${data[i][0]}`); // Log the name of the archived course
      } catch (e) {
        console.log(`Error archiving course: ${data[i][0]} - ${e.message}`);
      }
    }
  }
}


// Function to delete Google Classrooms labelled 'd' or 'D' in the 'Action' column
function deleteClassrooms(dryRun) {
  const sheetName = 'Classroom Info';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    console.log('Sheet not found!');
    return;
  }

  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();
  
  // Collect messages for the dry run
  let dryRunMessages = [];

  // Iterate over the rows, starting from the second row (index 1) to skip headers
  for (let i = 1; i < data.length; i++) {
    let action = data[i][6]; // 'Action' column
    let courseId = data[i][1]; // 'Class ID' column
    const calendarId = data[i][4]; // 'Calendar ID' column
    const driveFolderId = data[i][5]; // 'Drive Folder ID' column

    if (action && action.toLowerCase() === 'd') {
      if (dryRun) {
        dryRunMessages.push(`Would delete course: ${data[i][0]}, Course ID: ${courseId}`);
        dryRunMessages.push(`Would delete associated calendar: Calendar ID: ${calendarId}`);
        dryRunMessages.push(`Would delete associated Drive folder: Drive Folder ID: ${driveFolderId}`);
      } else {
        try {
          let calendar =  CalendarApp.getCalendarById(calendarId);
          calendar.deleteCalendar();
          console.log(`Deleted associated calendar: Calendar ID: ${calendarId}`);
        } catch (e) {
          console.log(`Error deleting calendar: ${calendarId} - ${e.message}`);
        }

        try {
          DriveApp.getFolderById(driveFolderId).setTrashed(true);
          console.log(`Deleted associated Drive folder: Drive Folder ID: ${driveFolderId}`);
        } catch (e) {
          console.log(`Error deleting Drive Folder: ${driveFolderId} - ${e.message}`);
        }

        try {
          Classroom.Courses.remove(courseId);
          console.log(`Deleted course: ${data[i][0]}, Course ID: ${courseId}`);
        } catch (e) {
          if (e.message.includes('The caller does not have permission')) {
            try {
              Classroom.Courses.Teachers.remove(courseId, 'me');
              console.log(`Removed user as a teacher from course: ${data[i][0]}, Course ID: ${courseId}`);
            } catch (removeError) {
              console.log(`Error removing user as teacher from course: ${data[i][0]} - ${removeError.message}`);
            }
          } else {
            console.log(`Error deleting course: ${data[i][0]} - ${e.message}`);
          }
        }
      }
    }
  }

  // Show the dry run messages in a dialogue box
  if (dryRun) {
    const ui = SpreadsheetApp.getUi();
    ui.alert('Dry Run Results', dryRunMessages.join('\n'), ui.ButtonSet.OK);
  } else {
    listGoogleClassrooms(); // Update the list
  }
}

function dryRunDelete() {
  deleteClassrooms(true);
}

function actuallyDelete() {
  archiveClassrooms()
  deleteClassrooms(false);
}
