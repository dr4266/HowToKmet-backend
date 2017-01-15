var db = require('../db-models/getQueries');

module.exports = function (animalId, userId) {
    return new Promise(function(callback) {
        db.getAnimalByIdAndUser(animalId, userId).then(function(result) {
            callback(result);
        });
    });
}
