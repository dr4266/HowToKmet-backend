var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');
var model = {};
model.auth = require('../models/authenticate/auth')
model.property = {};
model.property.all = require('../models/properties/getAllProperties');
model.property.getByUser = require('../models/properties/getPropertiesByUser');
model.property.getByIdAndUser = require('../models/properties/getPropertyByIdAndUser');
model.property.insert = require('../models/properties/insertProperty');
model.property.delete = require('../models/properties/deleteProperty');
model.property.check = require('../models/authenticate/checkPropertyParams');

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
  model.property.all().then(function(results) {
    res.status(200).json(results);
  });
});

// get a single task for a user
router.get('/:propertyId', function(req, res, next) {
  var decoded = req.decoded;
  model.property.getByIdAndUser(req.params.propertyId, decoded.id).then(function(result) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({"success": result.success, "message": result.message});
    }
  });

});

// get all properties for a user
router.get('/', function(req, res, next) {
  var decoded = req.decoded;

  model.property.getByUser(decoded.id).then(function(result) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(200).json({"success": result.success, "message": result.message});
    }
  });
});

router.post('/', function(req, res, next) {
  var decoded = req.decoded;
  model.property.check(req).then(function(result){
    if (result.success) {
      var property = {
        userId: decoded.id,
        gerk: req.body.gerk,
        name: req.body.name,
        description: req.body.description,
      };
      model.property.insert(property).then(function(result) {
        if (result.success) {
          res.status(201).json(result);
        } else {
          res.status(500).json({"success": false, "message": "There was a problem while inserting the property"});
        }
      });
    } else {
      // something went wrong with the parameters, notify the client
      res.status(400).json({success: result.success, message: result.message});
    }
  });

});

router.delete('/:propertyId', function(req, res, next) {
  var decoded = req.decoded;
  model.property.delete(req.params.propertyId, decoded.id).then(function(result) {
    if (result.success) {
      res.sendStatus(204);
    } else {
      res.status(400).json({"success": false, "message": result.message});
    }
  });
});


/* The default 404 route for people with a token */
router.get('*', function(req, res, next) {
  res.status(404).json({ "errorCode": 404, "errorMessage": "Shoot, looks like" +
    "the page you are trying to access does not exist." })
});

module.exports = router;
