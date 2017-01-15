var db = require('../db-models/insertQueries');

module.exports = function(request) {
    return new Promise(function(callback) {
        db.insertPropertyForUser(request).then(function(result) {
          callback(result);
        });
    });
}
