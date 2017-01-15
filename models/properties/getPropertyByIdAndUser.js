var db = require('../db-models/getQueries');

module.exports = function (propertyId, userId) {
    return new Promise(function(callback) {
        db.getPropertyByIdAndUser(propertyId, userId).then(function(result) {
            callback(result);
        });
    });
}
