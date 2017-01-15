var db = require('../db-models/deleteQueries');

module.exports = function (taskId, userId) {
    return new Promise(function(callback) {
        db.deleteTask(taskId, userId).then(function(result) {
            callback(result);
        });
    });
}
