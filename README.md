# ShowStreamCollator
### Purpose
 - Provides the json file to be added to cockpit for use of the *reminders* feature in the Listen apps
 - The json file provides an array of streamIDs for each showID, indicating which streams air that show.
###  Usage
 - Clone the repo, and navigate to the directory in the terminal
 - run `$ npm install`
 - run `$ node index`
 - This will generate the json file *show-stream-mapping.json* in the same directory as the repo.
In Cockpit, paste the contents of *show-stream-mapping.json* into the Mapping field for Show to Stream Mapping (reminders) (it looks empty but it’s not!), then hit save.
 - Verify the file is updated with the endpoint: [https://www.cbc.ca/listen/api/v1/app-config/ShowToStreamMapping](https://www.cbc.ca/listen/api/v1/app-config/ShowToStreamMapping)
