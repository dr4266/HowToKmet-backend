var db = require('../db-models/getQueries');
var config = require("../../config");
var jwt = require('jsonwebtoken');

module.exports = function(username, password) {
  return new Promise(function(callback) {
    db.getUserByUserNameAndPass(username, password).then(function(result) {
      if (result != null && typeof result !== 'undefined' && result.length > 0) {
        var token = jwt.sign(result[0], config.authentication.superSecret, {
          expiresIn: 3600 // expires in 60 minutes
        });
        var userInfo = result[0];
        // RAW query, so database atribute names are used on the result
        result = {
          "success": true,
          "message": "Enjoy your touken!",
          "token": token,
          "firstName": userInfo.kmetName,
          "lastName": userInfo.kmetSurname,
          "username": userInfo.kmetUsername,
          "email": userInfo.kmetEmail
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
