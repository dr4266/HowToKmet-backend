var db = require('../db-models/getQueries');
var config = require("../../config");
var jwt = require('jsonwebtoken');

module.exports = function(username, password) {
  return new Promise(function(callback) {
    db.getUserByUserNameAndPass(username, password).then(function(result) {
      if (result != null) {
        var token = jwt.sign(result.dataValues, config.authentication.superSecret, {
          expiresIn: 3600 // expires in 60 minutes
        });
        var userInfo = result.dataValues;
        result = {
          "success": true,
          "message": "Enjoy your touken!",
          "token": token,
          "firstName": userInfo.firstName,
          "lastName": userInfo.lastName,
          "username": userInfo.username,
          "email": userInfo.email
        };

      } else {
        result = {
          "success": false,
          "message": "Username and password do not match."
        };

      }
      callback(result);
    });
  });
}
