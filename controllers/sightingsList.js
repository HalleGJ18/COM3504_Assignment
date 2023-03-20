var data = [];
var Sighting = require('../models/sightings');
Sighting.find( function(err, results) {
    if (err) throw err;
    for(result of results) {
        data.push(result)
    }
    console.log(results);
});

module.exports = data;