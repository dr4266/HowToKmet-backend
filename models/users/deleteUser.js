var db = require('../db-models/deleteQueries');

module.exports = function (user) {
    return new Promise(function(callback) {
        db.deleteUser(user).then(function(result) {
            callback(result);
        });
    });
}
