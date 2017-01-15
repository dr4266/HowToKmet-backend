var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config.json');
var model = {};
model.users = {};
model.users.all = require('../models/users/getAllUsers');
model.users.insert = require('../models/users/insertUser');
model.users.delete = require('../models/users/deleteUser');
model.users.check = require('../models/authenticate/checkUserParams');

var uri = config.api.server.uri;
var securePort = config.api.server.securePort;
var port = config.api.server.port;

if (config.stage != "development") {
  uri = config.api.herokuserver.uri;
  port = config.api.herokuserver.port;
  securePort = config.api.herokuserver.securePort;
}

/**
* REGISTER user
*/
router.post('/', function(req, res, next) {
  //check for parameters
  model.users.check(req).then(function(valid) {
    if (valid.success) {
      // check for https, otherwise redirect (loops on heroku)
      if (true) {
        model.users.insert(req).then(function(result){
          // There was a problem with inserting the user
          if (!result.success) {
            res.status(400).json({success: result.success, message: result.message});
          } else {
            res.status(201).json(result);
          }
        });
      } else {
        res.redirect(307, 'https://' + uri + ":" +
          securePort + "/api/users");
      }
    } else {
      // parameters not valid
      res.status(400).json({success: valid.success, message: valid.message});
    }
  });
});

/**
* A request is not allowed further if a valid token is not present
*/
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.authentication.superSecret, function(err, decoded) {
      if (err) {
        res.status(403).json({ success: false, message: "Nice fake token mate ...", reason: "Invalid token" });
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

/*  GET /users
*   returns all (!) users in the database
*/
// only admins
router.get('/all', function(req, res, next) {
  model.users.all().then(function (result) {
    res.status(200).json(result);
  });
});

//allowed only for the user himself
router.delete('/:userId', function(req, res, next) {
  if (req.decoded.id == req.params.userId) {
    model.users.delete(req.params.userId).then(function(result) {
      res.status(204).json(result);
    });
  } else {
    res.status(403).json({"success": false, "message": "You can't just go" +
      " deleting other peoples accounts, that is not nice!"});
  }
});



/* The default 404 route */
router.get('*', function(req, res, next) {
  res.status(404).json({ "errorCode": 404, "errorMessage": "Shoot, looks like" +
    "the page you are trying to access does not exist." });
});

module.exports = router;
