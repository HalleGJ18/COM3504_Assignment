/**
 * Main Javascript file
 * Contains methods that support the chat room and getting the user's current location and
 */

//socketio variables:
let name = null;
let roomNo = null;
let socket = io();


/**
 * called by <body onload>
 * it connects the user to the room & displays any messages from the chat history
 * plus the associated actions
 *
 * @param birdId: The ID of the bird the chat belongs to.
 * @param historyMessages: an array containing JS objects that represent a chat message. Can be empty.
 */
function init(birdId, historyMessages, addedByName) {

    //check if the edit button should be made visible
    canEdit(addedByName);

    //connect to the room with the id of the bird
    connectToRoom(birdId);

    //if there are any history messages, loop through them and write them in the chat.
    if(historyMessages.length > 0) {
        for(let historyMessage of historyMessages) {
            writeOnHistory('<b>' + historyMessage.username + ':</b> ' + historyMessage.chatMessage);
        }
    }

    // called when a message is sent
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, name, chatText);
    addChatMessage(roomNo, chatText, name)
}

/**
 * used to connect to a room.  Gets the current username of the user and displays it in the chat.
 * Also configures the room Number to be the bird's id, thus making each room a unique number.
 * interface
 *
 * @param birdId: the id of the bird which the chat corresponds to.
 */
function connectToRoom(birdId) {
    getValueFromObjectStore('UserInformation', 'users', 1)
        .then(value => {
            name = value['username']
            document.getElementById('who_you_are').innerHTML= name;

        })
        .catch(error => {
            console.error('Error retrieving value:', error);
        });

    roomNo = birdId;
    socket.emit('create or join', roomNo, name);
}

/**
 * it appends the given html text to the history div
 * @param text: the text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');

    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * It adds a message to the chat
 * @param birdId - the ID of the bird
 * @param  - the message to be added
 * @param username - the username who sent the message
 */
function addChatMessage(birdId,chatMessage, username) {

    //using POST request to get all the bird information as JSON, then parsing it
    fetch('/bird', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            birdId: birdId,
            chatMessage: chatMessage,
            username: username
        })

    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(response)
            console.error(error);
        });
}

/**
 * Gets the curent geolocation of the user
 * After getting permission to get the user's coordinates, the coordinates are sent to an API
 * that returns a city.
 * Note: There is a known bug with the location API. Occasionally, an HTTPS request is sent instead of HTTP,
 * which leads to no results. In that instance, the user is alerted.
 */
function getLocation() {

    //if permission has been given - get the current position.
    //Then, pass it to the API to get a city.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            var query = 'http://api.positionstack.com/v1/reverse?access_key=359ea6dd8c8570c7df19d440a9de2234&query=' +
                position.coords.latitude + "," +
                position.coords.longitude

            fetch(query)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('location').value = data.data[0].locality;

                })
                .catch(error => {

                    //if the API forces HTTPS, a TypeError is returned. Let the user know that.
                    if(error == "TypeError: Cannot read properties of undefined (reading '0')") {
                        alert("The API is currently unable to get your location.");
                    }

                    console.log(error);
                });

        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

/**
 * Get the username from indexedDB
 * @param dbName - the name of the database
 * @param storeName - the name of the story
 * @param key - the key
 */
function getValueFromObjectStore(dbName, storeName, key) {
    return new Promise((resolve, reject) => {
        // Open the database
        const request = indexedDB.open(dbName);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onsuccess = () => {
            const db = request.result;

            // Start a transaction and retrieve the object store
            const transaction = db.transaction(storeName, 'readonly');
            const objectStore = transaction.objectStore(storeName);

            const countRequest = objectStore.count();
            countRequest.onsuccess = () => {
                console.log(countRequest.result);
                const getRequest = objectStore.get(countRequest.result);

                getRequest.onerror = () => {
                    reject(new Error('Failed to retrieve value from object store'));
                };

                getRequest.onsuccess = () => {
                    const value = getRequest.result;

                    if (value) {
                        resolve(value);
                    } else {
                        reject(new Error('Value not found in object store'));
                    }
                };
            };
        };
        request.onupgradeneeded = () => {
            reject(new Error('Database upgrade needed'));
        };
    });
}

/**
 * Compare who the document was added by and who the current user is
 * If the two match- Make the edit button visible
 * @param addedBy - Who the sighting was added by
 */
function canEdit(addedBy) {
    getValueFromObjectStore('UserInformation', 'users', 1)
        .then(value => {
            name = value['username']
            document.getElementById('who_you_are').innerHTML= name;

            if(addedBy == value['username']) {
                document.getElementById("EditButton").style.display = "block";
            }

        })
        .catch(error => {
            console.error('Error retrieving value:', error);
        });
}