var bodyParser = require("body-parser");
//var req = require('request');
var Sighting = require('../models/sightings');
var path = require('path');


exports.create = function (req, res) {
    var userData = req.body;
    var sighting = new Sighting({
        bird_name: userData.birdname,
        date: userData.date,
        location: userData.location,
        description: userData.description
    });

    sighting.save(function (err, results) {
        if (err)
            res.status(500).send('Invalid data!');
    //ntent-Type', 'application/json');
       // res.send(JSON.stringify(character));
        res.json({sighting: sighting});
    });
};






