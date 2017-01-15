var db = require('../db-models/getQueries');

module.exports = function (taskId) {
    return new Promise(function(callback) {
        db.getTaskById(taskId).then(function(result) {
            callback(result);
        });
    });
}
