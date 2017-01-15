var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');
var model = {};
model.auth = require('../models/authenticate/auth')
model.task = {};
model.task.all = require('../models/tasks/getAllTasks');
model.task.insert = require('../models/tasks/insertTask');
model.task.delete = require('../models/tasks/deleteTask');
model.task.getById = require('../models/tasks/getTaskById')
model.task.getByIdAndUser = require('../models/tasks/getTaskByIdAndUser');
model.task.getByUser = require('../models/tasks/getTasksByUser');
model.task.check = require('../models/authenticate/checkTaskParams');
model.task.update = require('../models/tasks/updateTaskForUser');
model.task.checkPut = require('../models/authenticate/checkPutTask');

/**
* Parse the config file
*/
var uri = config.api.server.uri;
var port = config.api.server.port;
var securePort = config.api.server.securePort;

if (config.stage != "development") {
  uri = config.api.herokuserver.uri;
  port = config.api.herokuserver.port;
  securePort = config.api.herokuserver.securePort;
}

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

//admin only
router.get('/all', function(req, res, next) {
  model.task.all().then(function(results) {
    res.status(200).json(results);
  });
});

/*
// Allowed for admins?
router.get('/:taskId', function(req, res, next) {
  model.task.getById(req.params.taskId).then(function(result) {
    if (result.success) {
      res.status(200).json(result.task);
    } else {
      res.status(400).json(result);
    }
  });
});
*/

// get a single task for a user
router.get('/:taskId', function(req, res, next) {
  var decoded = req.decoded;
  model.task.getByIdAndUser(req.params.taskId, decoded.id).then(function(result) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({"success": result.success, "message": result.message});
    }
  });
});

// get all tasks for a user
router.get('/', function(req, res, next) {
  var decoded = req.decoded;
  model.task.getByUser(decoded.id).then(function(result) {
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(200).json({"success": result.success, "message": result.message});
    }
  });
});

router.post('/', function(req, res, next) {
  var decoded = req.decoded;
  model.task.check(req).then(function(result){
    if (result.success) {
      var task = {
        userId: decoded.id,
        date: req.body.date,
        name: req.body.name,
        taskType: req.body.taskType,
        description: req.body.description,
        taskResource: req.body.taskResource
      };
      model.task.insert(task).then(function(result) {
        if (result.success) {
          res.status(201).json(result);
        } else {
          res.status(500).json({"success": false, "message": "There was a problem with inserting the task"});
        }
      });
    } else {
      // something went wrong with the parameters, notify the client
      res.status(400).json({success: result.success, message: result.message});
    }
  });
});

router.delete('/:taskId', function(req, res, next) {
  var decoded = req.decoded;
  model.task.delete(req.params.taskId, decoded.id).then(function(result) {
    if (result.success) {
      res.sendStatus(204);
    } else {
      res.status(400).json({"success": result.message, "message": result.message});
    }
  });
});

router.put('/:taskId', function(req, res, next) {
  var task = req.body;
  task.id = req.params.taskId;
  task.userId = req.decoded.id;
  model.task.checkPut(req).then(function(result) {
    if (result.success) {

      model.task.update(task).then(function(result){
        if (result.success) {
          res.status(200).json(result);
        } else {
          res.status(400).json(result);
        }
      });
    } else {
      res.status(400).json(result);
    }
  });
});


/* The default 404 route */
router.get('*', function(req, res, next) {
  res.status(404).json({ "errorCode": 404, "errorMessage": "Shoot, looks like" +
    "the page you are trying to access does not exist." })
});

module.exports = router;
