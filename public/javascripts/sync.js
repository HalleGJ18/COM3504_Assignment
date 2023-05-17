async function syncSightings() {
    // const registration = await navigator.serviceWorker.ready;
    // console.log("register sync")
    // await registration.sync.register("bird-sync");
    new Promise(function (resolve, reject) {
        Notification.requestPermission(function (result) {
            resolve();
        })
    }).then(function () {
        return navigator.serviceWorker.ready;
    }).then(async function (reg) {
        //here register your sync with a tagname and return it
        await reg.sync.register('bird-sync')
    }).then(function () {
        console.info('Sync registered');
    }).catch(function (err) {
        console.error('Failed to register sync', err.message);
    });
}
