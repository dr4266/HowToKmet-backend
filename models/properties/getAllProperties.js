var db = require('../db-models/getQueries');

module.exports = function () {
    return new Promise(function(callback) {
        db.getAllProperties().then(function(result) {
            callback(result);
        });
    });
}
