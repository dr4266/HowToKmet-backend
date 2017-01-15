var db = require('../db-models/deleteQueries');

module.exports = function (animalId, userId) {
    return new Promise(function(callback) {
        db.deleteAnimal(animalId, userId).then(function(result) {
            callback(result);
        });
    });
}
