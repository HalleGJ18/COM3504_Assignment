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

                // object store for username
                if(!db.objectStoreNames.contains("users")){
                    const userObjStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true});
                    console.log("create store")
                }

                // object store for sightings from mongodb
                if(!db.objectStoreNames.contains("prevBirds")){
                    const prevBirdObjStore = db.createObjectStore("prevBirds", { keyPath: "_id", autoIncrement: false});
                    console.log("create store")
                }

                // object store for sightings created offline
                if(!db.objectStoreNames.contains("birds"))
                {
                    const objectStore = db.createObjectStore("birds", { keyPath: "id", autoIncrement: true});

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


    event.respondWith(
        fetch(event.request).catch(function() {
            const url = (new URL(event.request.url));

            if (url.pathname === "/") {
                // catch home page
                return caches.match('/views/index.html');
            } else if (url.pathname === "/birds") {
                // catch sightings list
                return caches.match('/views/list.html');
            } else if (url.pathname === "/add") {
                // catch add sighting
                return caches.match('/views/add.html');
            } else if (url.pathname === "/bird") {
                // catch sighting details
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
        console.log("sync event")
        event.waitUntil(uploadSightings())
    }
});



function uploadSightings() {
    // loop through indexeddb
    // make post request to /add
    // clear indexeddb
    getAllFromObjectStore('UserInformation', 'birds')
        .then(values => {
            for (let value in values) {
                // upload sighting to server
                sendQuery("/sync", values[value])

            }
            var db;
            const request = indexedDB.open('UserInformation');
            request.onsuccess = () => {
                db = request.result;
                const t = db.transaction(["birds"], 'readwrite').objectStore("birds");

                // clear db of offline sightings
                const clearStoreReq = t.clear()
                clearStoreReq.onsuccess = (event) => {
                    console.log("offline sightings cleared")
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
    // send post request to server for sync event
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