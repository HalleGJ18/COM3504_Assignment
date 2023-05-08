function sendAjaxQuery(url, data) {

    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            var ret = dataR;
            // in order to have the object printed by alert
            // we need to JSON stringify the object
            document.getElementById('results').innerHTML= JSON.stringify(ret);
        },
        error: function (xhr, status, error) {

            alert('Error: ' + error.message);
        }
    });
}

function onSubmit() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    console.log(data);
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery('/index', data);
    event.preventDefault();
}


//socketio stuff:
let name = null;
let roomNo = null;
let socket = io();


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init(birdId, historyMessages) {
    // it sets up the interface so that userId and room are selected

    connectToRoom(birdId);

    if(historyMessages.length > 0) {
        console.log("write on history yee")
        for(let historyMessage of historyMessages) {
            writeOnHistory('<b>' + historyMessage.username + ':</b> ' + historyMessage.chatMessage);
        }
    }

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            //document.getElementById('who_you_are').innerHTML= userId;
            document.getElementById('in_room').innerHTML= ' '+room;

        }
    });
    // called when a message is received
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
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom(birdId) {

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

    getValueFromObjectStore('UserInformation', 'users', 1)
        .then(value => {
            console.log('Retrieved value:', value['username']);
            console.log("ayaayayayaa")
            name = value['username']
            document.getElementById('who_you_are').innerHTML= name;
            document.getElementById('addedBy').value = value['username'];

        })
        .catch(error => {
            console.error('Error retrieving value:', error);
        });




    roomNo = birdId; //this will be the id of the sighting
    //name = Math.round(Math.random() * 10000); //this will be the name the user gives on login
    //if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);

}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

function addChatMessage(birdId,chatMessage, username) {
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