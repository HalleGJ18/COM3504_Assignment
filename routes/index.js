var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");
var sighting = require('../controllers/sightings');
//var sightingList = require('../controllers/sightingsList');
var getData = require('../controllers/sightingsList');
var Sighting = require('../models/sightings');
var multer = require('multer');

// storage defines the storage options to be used for file upload with multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    // Make the file name the date + the file extension
    filename =  Date.now() + '.' + file_extension[file_extension.length-1];
    cb(null, filename);
  }
});
var upload = multer({ storage: storage });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bird Sightings Logger' });
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Bird Sightings Logger' });
});

router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add a new Sighting' });
});

router.post('/add',upload.single('myImg'), function(req, res) {
  sighting.create(req,res);
});

router.get('/birds', function(req, res, next) {
  var sightingsList = [];
  Sighting.find({}, function(err, results) {
    if (err) return next(err);
    for(let result of results) {
      sightingsList.push(result)
      result.img = result.img.slice(7)
      result.detailedLink = "/bird?id=" + result.id
    }
    //console.log(results);
    console.log(typeof sightingsList)
    res.render('list', {
      title: 'All sightings',
      data: sightingsList}
    );
  });
});

router.get('/bird', function(req, res, next) {

  Sighting.find({_id: req.query.id}, function(err, results) {
    if (err) return next(err);
    console.log(results);
    console.log(results[0].img);
    results[0].img = results[0].img.slice(7)

    res.render('bird', {
      title: 'Sighting Details',
      birdData: results[0],
      historyMessages:results[0].chatMessages}
    );
  });
});

router.post('/bird', (req, res) => {
  const { birdId, chatMessage, username } = req.body;

  Sighting.findById(birdId, (err, sighting) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating user');
    } else {
      sighting.chatMessages.push({
        chatMessage: chatMessage,
        username: username
      });
      sighting.save((err, savedSighting) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating bird');
        } else {
          res.send(savedSighting);
        }
      });
    }
  });
});

""

module.exports = router;
