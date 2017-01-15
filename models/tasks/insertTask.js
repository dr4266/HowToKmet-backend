var db = require('../db-models/insertQueries');

module.exports = function (request) {
    return new Promise(function(callback) {
        db.insertTaskForUser(request).then(function(result) {
          callback(result);
        });
    });
}
