var db = require('../db-models/updateQueries');

module.exports = function (request) {
    return new Promise(function(callback) {
        db.updateTaskForUser(request).then(function(result) {
          callback(result);
        });
    });
}
