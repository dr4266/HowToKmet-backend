var dbConfig = require('./dbConfig');
var User = dbConfig.User;
var Kek = dbConfig.Kek
var Task = dbConfig.Task;
var Animal = dbConfig.Animal;
var Property = dbConfig.Property;

module.exports = {
  getAllUsers: function () {
    return new Promise(function (callback) {
      User.findAll().then(function(users) {
        callback(users);
      });
    });
  },
  getUserByUserNameAndPass: function(_username, _password) {
    return new Promise(function(callback) {
      dbConfig.sequelize.query('SELECT * FROM public."users" AS u WHERE u.username = ? AND u.password = crypt(?, u.password) LIMIT 1 ',
      { replacements: [_username, _password], type: dbConfig.sequelize.QueryTypes.SELECT }).then(function(result) {
        callback(result);
      });
    });
  },
  getAllKeks: function() {
    return new Promise(function(callback) {
      Kek.findAll().then(function(keks) {
        callback(keks);
      });
    });
  },
  getAllTasks: function() {
    return new Promise(function(callback) {
      Task.findAll().then(function(tasks) {
        callback(tasks);
      });
    });
  },
  getTaskById: function(taskId) {
    return new Promise(function(callback) {
      Task.findOne({
        where: {
          id: taskId
        }
      }).then(function(task) {
        result = {};
        if (task == null) {
          result.success = false;
          result.message = "A task with this id doesn't exist";
        } else {
          result.success = true;
          result.message = "OK";
          result.task = task;
        }
        callback(result);
      });
    });
  },
  getTaskByIdAndUser: function(taskId, userId) {
    return new Promise(function (callback) {
      Task.findOne({
        where: {
          id: taskId,
          userId: userId
        }
      }).then( function(task) {
          result = {};
          if (task == null) {
            result.success = false;
            result.message = "This user doesn't have this task / task doesn't exist";
          } else {
            result.success = true;
            result.message = "OK";
            result.task = task;
          }
          callback(result);
        });
      });
  },
  getTasksByUser: function(userId) {
    return new Promise(function(callback) {
      Task.findAll({
        where: {
          userId: userId
        }
      }).then(function(tasks) {
        results = {};
        if (tasks.length > 0) {
          results.success = true;
          results.message = "OK";
          results.tasks = tasks;
        } else {
          results.success = false;
          results.message = "User has no registered tasks";
        }
        callback(results);
      });
    });
  },
  getAnimalsByUser: function(userId) {
    return new Promise(function(callback) {
      Animal.findAll({
        where: {
          userId: userId
        }
      }).then(function(animals) {
        results = {};
        if (animals.length > 0) {
          results.success = true;
          results.message = "OK";
          results.animals = animals;
        } else {
          results.success = false;
          results.message = "User has no registered animals";
        }
        callback(results);
      });
    });
  },
  getAllAnimals: function() {
    return new Promise(function (callback) {
      Animal.findAll().then(function(animals) {
        callback(animals);
      });
    });
  },
  getAnimalByIdAndUser: function(animalId, userId) {
    return new Promise(function (callback) {
      Animal.findOne({
        where: {
          id: animalId,
          userId: userId
        }
      }).then( function(animal) {
          result = {};
          if (animal == null) {
            result.success = false;
            result.message = "This user doesn't have this property / combination doesn't exist";
          } else {
            result.success = true;
            result.message = "OK";
            result.animal = animal;
          }
          callback(result);
        });
      });
  },
  getPropertiesByUser: function(userId) {
    return new Promise(function(callback) {
      Property.findAll({
        where: {
          userId: userId
        }
      }).then(function(properties) {
        results = {};
        if (properties.length > 0) {
          results.success = true;
          results.message = "OK";
          results.properties = properties;
        } else {
          results.success = false;
          results.message = "User has no registered properties";
        }
        callback(results);
      });
    });
  },
  getAllProperties: function(propertyId) {
    return new Promise(function (callback) {
      Property.findAll().then(function(properties) {
        callback(properties);
      });
    });
  },
  getPropertyByIdAndUser: function(propertyId, userId) {
    return new Promise(function (callback) {
      Property.findOne({
        where: {
          id: propertyId,
          userId: userId
        }
      }).then( function(property) {
          result = {};
          if (property == null) {
            result.success = false;
            result.message = "This user doesn't have this property / combination doesn't exist";
          } else {
            result.success = true;
            result.message = "OK";
            result.property = property;
          }
          callback(result);
        });
      });
  },
}
