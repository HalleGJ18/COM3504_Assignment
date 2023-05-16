var express = require('express');
var router = express.Router();
var sighting = require('../controllers/sightings');
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

/* GET home page through /index. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Bird Sightings Logger' });
});

/* GET add bird form. */
router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add a new Sighting' });
});

/* POST add bird form
 * Forwards the bird creation to the Sighting controller
*/
router.post('/add',upload.single('myImg'), function(req, res) {
  sighting.create(req,res);
});

/* GET birds list
* Loads in all the birds from MongoDB, then passes the data to the view.
*/
router.get('/birds', function(req, res, next) {
  var sightingsList = [];

  Sighting.find({}, function(err, birds) {
    if (err) return next(err);
    for(let bird of birds) {
      sightingsList.push(bird)
      bird.img = bird.img.slice(7)
      bird.detailedLink = "/bird?id=" + bird.id
    }
    res.render('list', {
      title: 'All sightings',
      data: sightingsList}
    );
  });

});

/* GET a single bird's details
* Loads in the bird's details from MongoDB based on its ID, then passes the data to the view.
*/
router.get('/bird', function(req, res, next) {
  Sighting.find({_id: req.query.id}, function(err, bird) {
    if (err) return next(err);

    bird[0].img = bird[0].img.slice(7)

    res.render('bird', {
      title: 'One birdo',
      birdData: bird[0],
      historyMessages:bird[0].chatMessages}
    );

  });
});

/* POST /bird (chat messages)
* Add the chat message to the frontend
*/
router.post('/bird', (req, res) => {
  const { birdId, chatMessage, username } = req.body;

  Sighting.findById(birdId, (err, sighting) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating bird');
    }
    else {
      sighting.chatMessages.push({
        chatMessage: chatMessage,
        username: username
      });

      sighting.save((err, savedSighting) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating bird');
        }
        else {
          res.send(savedSighting);
        }
      });

    }
  });
});

/* GET edit bird form. */
router.get('/edit', function(req, res, next) {
  Sighting.find({_id: req.query.id}, function(err, bird) {
    if (err) return next(err);

    bird[0].img = bird[0].img.slice(7)

    res.render('edit', {
      title: 'One birdo',
      birdData: bird[0],
      });
  });
});

/* POST update bird form
 * Update the bird sighting
*/
router.post('/edit', function(req, res) {
  let birdId = req.query.id
  let bird_name = req.body.birdname;
  let date = req.body.date;
  let location = req.body.location;
  let description = req.body.description;

  //update the sighting
  Sighting.updateOne({ _id: birdId }, { $set: { bird_name: bird_name, date:date, location:location,
      description: description} })
      .then(() => {
        console.log('Sighting updated successfully');
        alert("Sighting updated successfully");
      })
      .catch((error) => {
        console.log('Error updating sighting:', error);

      });
});

module.exports = router;
