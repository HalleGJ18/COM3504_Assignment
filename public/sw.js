// import getAllFromObjectStore from "/javascripts/getData.js";

const CACHE_NAME = 'SightingsAppV2'; // update the name to get the sw to recache if resources have been updated


// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');

    event.waitUntil((async () => {

        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll([
                '/views/index.html',
                '/views/list.html',
                '/views/add.html',
                '/views/bird.html',
                '/javascripts/generateOfflineTable.js',
                '/javascripts/getData.js',
                '/javascripts/sync.js',
                '/stylesheets/style.css',
                '/partials/header.ejs',
                '/partials/footer.ejs',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css',
                'https://code.jquery.com/jquery-3.2.1.slim.min.js',
                'https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js'
            ]);
        }
        catch{
            console.log("error occured while caching...")
        }

    })());
});

//clear cache on reload
self.addEventListener('activate', event => {
    console.log('activate')
// Remove old caches
    event.waitUntil(
        (async () => {

            // init db
            var db;
            const request =  indexedDB.open('UserInformation');
            console.log("request db")
            request.onerror = () => {
                console.error("Connection Error");
            };

            request.onupgradeneeded = () => {
                db = request.result;
                //creating object

                if(!db.objectStoreNames.contains("users")){
                    const userObjStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true});
                    console.log("create store")
                }

                if(!db.objectStoreNames.contains("prevBirds")){
                    const prevBirdObjStore = db.createObjectStore("prevBirds", { keyPath: "_id", autoIncrement: false});
                    console.log("create store")
                }

                if(!db.objectStoreNames.contains("birds"))
                {
                    const objectStore = db.createObjectStore("birds", { keyPath: "id", autoIncrement: true});
                    // objectStore.createIndex('name','name', {unique:false});
                    // objectStore.createIndex('date','date', {unique:false});
                    // objectStore.createIndex('location','location', {unique:false});
                    // objectStore.createIndex('description','description', {unique:false});
                    // objectStore.createIndex('addedBy','addedBy', {unique:false});

                }
            }

            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== CACHE_NAME) {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })



        })()
    )

});

self.addEventListener('fetch', function(event) {

    // console.log('Service Worker: Fetch', event.request.url);

    event.respondWith(
        fetch(event.request).catch(function() {
            const url = (new URL(event.request.url));
            if (url.pathname === "/") {
                console.log(url.pathname)
                console.log("home")
                return caches.match('/views/index.html');
            } else if (url.pathname === "/birds") {
                console.log(url.pathname)
                console.log("birds list")
                return caches.match('/views/list.html');
            } else if (url.pathname === "/add") {
                console.log(url.pathname)
                console.log("add")
                return caches.match('/views/add.html');
            } else if (url.pathname === "/bird") {
                console.log(url.pathname)
                console.log("bird details")
                return caches.match('/views/bird.html');
            }
            async function requestBackgroundSync() {
                await self.registration.sync.register('bird-sync');
            }
            requestBackgroundSync().then(r => {
                console.log("register that sync")
            })

            return caches.match(event.request)
        })
    )
});


self.addEventListener('sync', event => {
    if (event.tag === 'bird-sync') {
        console.log("sync time")
        // event.waitUntil(sendToServer());
        event.waitUntil(uploadSightings())
    }
});



function uploadSightings() {
    console.log("upload")
    // loop through indexeddb
        // make post request to /add
    //clear indexeddb
    getAllFromObjectStore('UserInformation', 'birds')
        .then(values => {
            console.log(values);
            for (let value in values) {
                // insertRows(values[value], value)
                // console.log(value)
                console.log(values[value])
                // upload sighting
                sendQuery("/sync", values[value])

            }
            var db;
            const request = indexedDB.open('UserInformation');
            request.onsuccess = () => {
                db = request.result;
                console.log("success");
                const t = db.transaction(["birds"], 'readwrite').objectStore("birds");
                // clear db
                const clearStoreReq = t.clear()
                clearStoreReq.onsuccess = (event) => {
                    console.log("cleared")
                }
            }

        })
        .catch(error => {
            console.error('Error retrieving value:', error);
        });
}


function getAllFromObjectStore(dbName, storeName) {
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

            const getRequest = objectStore.getAll();

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

        request.onupgradeneeded = () => {
            reject(new Error('Database upgrade needed'));
        };
    });
}


function sendQuery(url, data) {
    fetch('http://localhost:3000/sync', {
        method: 'POST',
        body: JSON.stringify({
            birdname: data['bird_name'],
            date: data['date'],
            location: data['location'],
            description: data['description'],
            addedBy: data['addedBy']
        }),

        headers: {'Content-Type': 'application/json'},
    }).then (res => console.log(res))

}