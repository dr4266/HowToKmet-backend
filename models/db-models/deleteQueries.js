var dbConfig = require('./dbConfig');
var User = dbConfig.User;
var Task = dbConfig.Task;
var Animal = dbConfig.Animal;
var Property = dbConfig.Property;

module.exports = {
  /* Delete a user from the database */
  deleteUser: function(userId) {
    return new Promise(function(callback) {
      User.findOne({
        where: {
          id: userId
        }
      }).then(function(user) {
        user.destroy();
        result = {
          success: true,
          message: "NO CONTENT"
        }
        callback(result);
      });
    });
  },
  deleteTask: function(taskId, userId) {
    return new Promise(function(callback) {
      Task.findOne({
        where: {
          id: taskId,
          userId: userId
        }
      }).then(function(task) {
        result = {};
        if (task != null) {
          task.destroy();
          result = {
            "success": true,
            "message": "OK"
          }
        } else {
          result.success = false;
          result.message = "This user has no such task";
        }
        callback(result);
      });
    });
  },
  deleteProperty: function(propertyId, userId) {
    return new Promise(function(callback) {
      Property.findOne({
        where: {
          id: propertyId,
          userId: userId
        }
      }).then(function(property) {
        result = {};
        if (property == null) {
          result.success = false;
          result.message = "This user has no such property";
        } else {
          property.destroy();
          result = {
            "success": true,
            "message": "OK"
          }
        }
        callback(result);
      });
    });
  },
  deleteAnimal: function(animalId, userId) {
    return new Promise(function(callback) {
      Animal.findOne({
        where: {
          id: animalId,
          userId: userId
        }
      }).then(function(animal) {
        result = {};
        if (animal == null) {
          result.success = false;
          result.message = "This user has no such animal";
        } else {
          animal.destroy();
          result = {
            "success": true,
            "message": "OK"
          }
        }
        callback(result);
      });
    });
  },
}
