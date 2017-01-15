var db = require('../db-models/insertQueries');

module.exports = function (farmer) {
    return new Promise(function(callback) {
        db.insertUser(farmer).then(function(result) {
          callback(result);          
        });
    });
}
