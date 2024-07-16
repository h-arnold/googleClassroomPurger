# Google Classroom Purger

*Quickly clean up the detritus left by years of archived Google Classrooms*

This script allows you to bulk archive and delete Google Classrooms that you own. When deleting Google Classrooms, it will also delete the associated Google Calendar and Google Drive folders, freeing up valuable Google Drive space.

If you don't own the Google Classroom (i.e. you've been added to a Google Classroom by someone else), this script will remove you from the classroom and associated Google Calendars and Drive folders.

## Warnings
This script will *permanently and irrecoverably* delete any Google Classrooms you own. Use this care. I *strongly* recommend you use the `Dry Run` option first to be absolutely confident you're deleting the correct class. 

With that in mind, I only recommend running this script at the beginning or the end of the academic year, where accidental deletions *should* be less disruptive.

## Features

- List all Google Classrooms you own, are a member of, whether active or achived.
- Bulk archival of classes.
- Bulk deletion of classes, including their attached Google Calendar and Google Drive folders.

## Setup Instructions

1. **Create a Google Sheet:**
   - Make a copy of the [template Google Sheet](https://docs.google.com/spreadsheets/d/17w5HoBLA2lFon44dlvIWN7uJEsV74JPBqHpm5i5BSWY/edit?usp=sharing) as a starting point.

2. **Authorise the Script:**
   - Click on the `Classroom Purger` button at the top of the menu bar (it may take a few seconds to appear) and click 'List Google Classrooms'.
   - You will then be prompted to authorise the script. Please click 'Ok' and 'Continue' as appropriate.

3. **Using the Script:**
   - After authorisation, reload the Google Sheet.
   - You will see a new menu item called "Classroom Purger" in the menu bar.

## Usage

1. **List Google Classrooms:**
   - Click on `Classroom Management` > `List Google Classrooms`.
   - The script will list all Google Classroom courses in the `Classroom Info` sheet.

2. **Dry Run

 Archive or Delete:**
   - Click on `Classroom Management` > `Dry Run Archive or Delete`.
   - A prompt will appear asking you to enter "a" for archive or "d" for delete.
   - The script will show a dialogue box listing the actions it would perform without actually performing them.

3. **Actually Archive or Delete:**
   - Click on `Classroom Management` > `Actually Archive or Delete`.
   - A prompt will appear asking you to enter "a" for archive or "d" for delete.
   - The script will perform the actual archive or delete actions as specified.

## Contributing

Contributions are very welcome. If you have any changes or suggestions, please open a pull request.

## License

This project is licensed under the MIT License.

---

With this README, users should be able to understand how to set up and use the Google Classroom Management script effectively.
