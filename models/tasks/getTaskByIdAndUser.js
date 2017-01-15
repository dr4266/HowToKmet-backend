var db = require('../db-models/getQueries');

module.exports = function (taskId, userId) {
    return new Promise(function(callback) {
        db.getTaskByIdAndUser(taskId, userId).then(function(result) {
            callback(result);
        });
    });
}
