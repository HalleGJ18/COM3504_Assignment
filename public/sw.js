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
                    db.createObjectStore("users", { keyPath: "id", autoIncrement: true});
                    console.log("create store")
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

    // event.waitUntil(
    //     (async () => {
    //
    //     })
    // )
    console.log("activate end")
})

self.addEventListener('fetch', function(event) {

    // console.log('Service Worker: Fetch', event.request.url);

    const request = event.request;
    const url = (new URL(request.url));
    // console.log(url)



    if (url.pathname == "/") {
        console.log(url.pathname)
        console.log("home")
    } else if (url.pathname == "/birds") {
        console.log(url.pathname)
        console.log("birds list")
    } else if (url.pathname == "/add") {
        console.log(url.pathname)
        console.log("add")
    } else if (url.pathname == "/bird") {
        console.log(url.pathname)
        console.log("bird details")
    }

    // console.log("Url", event.request.url.pathname);

    // console.log(event.request.mode)
    // console.log(event.request.method)

    // if (event.request.mode === 'GET') {
    //     console.log(event.request.headers)
    // }




    // if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('/birds'))) {
    //     event.respondWith(
    //         fetch(event.request.url).catch(error => {
    //             // Return the offline page
    //             return caches.match('/views/list.html');
    //         })
    //     );
    // }
    // else if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').match('/'))) {
    //     event.respondWith(
    //         fetch(event.request.url).catch(error => {
    //             // Return the offline page
    //             return caches.match('/views/index.html');
    //         })
    //     );
    // }
    // else{
    //     // Respond with everything else if we can
    //     event.respondWith(caches.match(event.request)
    //         .then(function (response) {
    //             return response || fetch(event.request);
    //         })
    //     );
    // }


    // Respond with everything else if we can
    event.respondWith(caches.match(event.request)
        .then(function (response) {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('sync', event => {
    if (event.tag === 'bird-sync') {
        console.log("sync time")
        // event.waitUntil(sendToServer());
    }
});