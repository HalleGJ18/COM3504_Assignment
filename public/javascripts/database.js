let db;

//Opening the db
const request = indexedDB.open('sightingsApp',2);
request.onupgradeneeded = function(event){
    db = event.target.result;
};

request.onsuccess = function(event) {
    db = event.target.result;
};
//database connection
request.onerror = function(event) {
    console.error("Database Connection Error", event.target.error);
};


const objectStore = db.createObjectStore('userInfo', { keyPath: 'id', autoIncrement: true});
objectStore.createIndex('name','name',{ unique: 'false'});


const t = db.transaction(['objects'], 'readwrite');
const obj = t.objectStore('objects');
//adding database
const user = {id: 1, name:'testUser'};
const req = obj.add(user);

//operation status
request.onsuccess = function(event) {
    console.log('Success:', event.target.result);
};
request.onerror = function(event) {
    console.error('Task unsuccessful:', event.target.error);
};