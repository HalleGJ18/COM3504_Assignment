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

function getURLParams() {
    // extract bird id from url
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(id)
    return id;

}

function getEntryFromObjectStore(dbName, storeName, key) {
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

            const getRequest = objectStore.get(key);

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
