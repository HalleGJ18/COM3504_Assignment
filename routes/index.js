var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var sighting = require('../controllers/sightings');
var sightingList = require('../controllers/sightingsList');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Form' });
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'My Form' });
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add a new Sighting to the DB' });
});

router.post('/add', function(req, res) {
  sighting.create(req,res);
});

router.get('/list', function(req, res, next) {
  res.render('list', {
    title: 'All birdos',
    data: sightingList }
  );
});



//router.post('/index', character.getAge);

module.exports = router;
