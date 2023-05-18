# COM3504_Assignment

## Installation Instructions:
1. Run npm install
2. Start a MongoDB instance, on port 27017
3. Run the project through Webstorm
4. Connect to localhost:3000

github repository: https://github.com/HalleGJ18/COM3504_Assignment

## System Implementation
Using Node.js, ejs, indexedDB, MongoDB and more, we have built a progressive bird
watching application  that supports online and offline interaction.

The web application supports various functionalities, including:

**Creating a new sighting** - users can create a new sighting of a bird they have seen through a form.
They can upload an image of the bird. Their current location is automatically
filled in using the Google geolocation API. Users can also query the Knowledge Graph to look for the bird identification.

When offline, users can create a new sighting, that is added into the project once they go online.

<<IMAGE OF CREATING A NEW SIGHTING>>

**Browse a list of all sightings** - users can view a list of all sightings that have been added to
the application. They can also choose to view detailed information about each sighting by clicking the
"Detailed view" button.

When offline, the user sees a list of the sightings that they have created.

<<IMAGE OF BROWSING LIST OF SIGHTINGS>>

**View a sighting in detail** - Each sighting has its own detailed view. This detailed view
reviews a lot more information about the bird based on its identification.

When offline, the user can see the detailed view of the sightings they have created.

**Edit a sighting** - if the username of the current user matches the creator of a sighting, the user is able to
edit their sighting.

When offline, the user can edit their sighting- the changes will be uploaded when they go online again.

<<IMAGE OF EDIT SIGHTING>>

**Chat with other users** - each sighting has a chat associated with it. Users can chat with other
users about the birds. The history of messages is stored in MongoDB and displayed
when a sighting is loaded.

<<IMAGE OF CHAT>>

