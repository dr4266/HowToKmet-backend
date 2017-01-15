var db = require('../db-models/getQueries');

module.exports = function (userId) {
    return new Promise(function(callback) {
        db.getTasksByUser(userId).then(function(result) {
            callback(result);
        });
    });
}
