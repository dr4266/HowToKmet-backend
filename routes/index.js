var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');
var model = {};
model.auth = require('../models/authenticate/auth')
model.keks = {};
model.keks.all = require('../models/keks/getAllKeks');

/**
* Parse the config file
*/
var uri = config.api.server.uri;
var port = config.api.server.port;
var securePort = config.api.server.securePort;

router.post('/authenticate', function(req, res, next){
  // check for a https connection
  if (req.secure) {
    //try to authenticate and resond with a token / error
    model.auth(req.body.username, req.body.password).then(function(result) {
      if (!result.success) {
        res.status(400).json(result)
      } else {
        res.status(200).json(result);
      }
    });
  } else {
    res.redirect(307, 'https://' + uri + ":" + securePort + "/api/authenticate");
  }
});

/**
* GET all the keks in the database
*/
router.get('/keks', function(req, res, next){
  model.keks.all().then(function(results) {
    res.status(200).json(results);
  });
});

/**
* CORS options response
*/
router.options('/*', function(req, res, next){
  res.sendStatus(200);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
