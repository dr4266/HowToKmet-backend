var db = require('../db-models/getQueries');

module.exports = function () {
    return new Promise(function(callback) {
        db.getAllAnimals().then(function(result) {
            callback(result);
        });
    });
}
