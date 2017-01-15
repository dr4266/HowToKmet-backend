var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');
var model = {};
model.auth = require('../models/authenticate/auth')
model.animal = {};
model.animal.all = require('../models/animals/getAllAnimals');
model.animal.getByUser = require('../models/animals/getAnimalsByUser');
model.animal.getByIdAndUser = require('../models/animals/getAnimalByIdAndUser');
model.animal.insert = require('../models/animals/insertAnimal');
model.animal.delete = require('../models/animals/deleteAnimal');
model.animal.check = require('../models/authenticate/checkAnimalParams');

/**
* Parse the config file
*/
var uri = config.api.server.uri;
var port = config.api.server.port;
var securePort = config.api.server.securePort;

// A token should be present (not all methods check for it)
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.authentication.superSecret, function(err, decoded) {
      if (err) {
        res.status(403).json({ success: false, message: "Nice fake token mate.", reason: "Invalid token" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'Well mate, you will need a token for that.'
    });
  }
});

//allowed for admin
router.get('/all', function(req, res, next) {
  model.animal.all().then(function(results) {
    res.status(200).json(results);
  });
});

// get a single task for a user
router.get('/:animalId', function(req, res, next) {
  var decoded = req.decoded;
  model.animal.getByIdAndUser(req.params.animalId, decoded.id).then(function(result) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({"success": result.success, "message": result.message});
    }
  });
});

// get all animals for a user
router.get('/', function(req, res, next) {
  var decoded = req.decoded;
  model.animal.getByUser(decoded.id).then(function(result) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(200).json({"success": result.success, "message": result.message});
    }
  });
});

router.post('/', function(req, res, next) {
var decoded = req.decoded;
  //check parameters
  model.animal.check(req).then(function(result){
    if (result.success) {
      var animal = {
        userId: decoded.id,
        alive: req.body.alive,
        birthdate: req.body.birthdate,
        name: req.body.name,
        description: req.body.description,
      };
      model.animal.insert(animal).then(function(result) {
        if (result.success) {
          res.status(201).json(result);
        } else {
          res.status(500).json({"success": false, "message": "There was a problem while inserting the animal"});
        }
      });
    } else {
      // something went wrong with the parameters, notify the client
      res.status(400).json({success: result.success, message: result.message});
    }
  });

});

router.delete('/:animalId', function(req, res, next) {
  var decoded = req.decoded;
  model.animal.delete(req.params.animalId, decoded.id).then(function(result) {
    if (result.success) {
      res.sendStatus(204);
    } else {
      res.status(400).json({"success": false, "message": result.message});
    }
  });
});


/* The default 404 route */
router.get('*', function(req, res, next) {
  res.status(404).json({ "errorCode": 404, "errorMessage": "Shoot, looks like" +
    "the page you are trying to access does not exist." })
});

module.exports = router;
