
var Sighting = require('../models/sightings');
async function getData() {
    var data = [];
    Sighting.find( function(err, results) {
        if (err) throw err;
        for(result of results) {
            data.push(result)
        }
        console.log(results);
    });
}

module.exports = getData;