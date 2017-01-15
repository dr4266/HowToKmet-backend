var db = require('../db-models/deleteQueries');

module.exports = function (propertyId, userId) {
    return new Promise(function(callback) {
        db.deleteProperty(propertyId, userId).then(function(result) {
            callback(result);
        });
    });
}
