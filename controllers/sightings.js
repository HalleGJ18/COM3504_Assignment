var bodyParser = require("body-parser");
//var req = require('request');
var Sighting = require('../models/sightings');
var path = require('path');
var mongoose = require('mongoose');
var db = require('../databases/sightings.js')


exports.create = function (req, res) {
    var userData = req.body;
    console.log(userData);
    var sighting = new Sighting({
        bird_name: userData.birdname,
        date: userData.date,
        location: userData.location,
        description: userData.description,
        addedBy: userData.addedBy,
        img: req.file.path,
        identification: userData.identifiedName,
        abstract: userData.abstract,
        uri: userData.uri
    });

    sighting.save(function (err, results) {
        if (err)
            res.status(500).send('Invalid data!');
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify(sighting));
        res.redirect("/birds");

    });

};

exports.sync = function (req, res) {
    var userData = req.body;
    var sighting = new Sighting({
        bird_name: userData.birdname,
        date: userData.date,
        location: userData.location,
        description: userData.description,
        addedBy: userData.addedBy
    });

    sighting.save(function (err, results) {
        if (err) {
            res.status(500).send('Invalid data!');
            // res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(sighting));
        }


    });

};






