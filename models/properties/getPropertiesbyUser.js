var db = require('../db-models/getQueries');

module.exports = function (userId) {
    return new Promise(function(callback) {
        db.getPropertiesByUser(userId).then(function(result) {
            callback(result);
        });
    });
}
