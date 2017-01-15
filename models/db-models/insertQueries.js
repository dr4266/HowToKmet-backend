var dbConfig = require('./dbConfig');
var User = dbConfig.User;
var Task = dbConfig.Task;
var Animal = dbConfig.Animal;
var Property = dbConfig.Property;


module.exports = {
  /* Insert a new user into the database
  * @param farmer   the post request header
  */
  insertUser: function(farmer) {
    return new Promise(function(callback) {
      // Check if the username or email is taken
      User.findOne({
        where: {
          $or: {
            username: farmer.body.username,
            email: farmer.body.email,
          }
        }
      }).then(function(exists) {
        if (exists == null) {
          // Create a new user since email and username are available
          User.create({
            firstName: farmer.body.firstName,
            lastName: farmer.body.lastName,
            username: farmer.body.username,
            password: farmer.body.password,
            email: farmer.body.email
          }).then(function(user) {
            result = {
              success: true,
              message: "A new user has been created",
              user: user
            }
            callback(result);
          });
        } else {
          result = {};
          result.success = false;
          if (farmer.body.email == exists.email &&
              farmer.body.username == exists.username) {
            result.message = "Username and email are already taken";
          } else if (farmer.body.email == exists.email) {
            result.message = "Email is already registered";
          } else if  (farmer.body.username == exists.username) {
            result.message = "Username is already taken";
          }
          callback(result);
        }
      });
    });
  },
  insertTaskForUser: function(task) {
    return new Promise(function(callback) {
      Task.create({
        userId: task.userId,
        date: task.date,
        name: task.name,
        taskType: task.taskType,
        taskResource: task.taskResource,
        description: task.description
      }).then(function(newTask) {
        result = {
          success: true,
          message: "OK",
          task: newTask
        };
        callback(result);
      });
    });
  },
  insertPropertyForUser: function(property) {
    return new Promise(function(callback) {
      Property.create({
        userId: property.userId,
        name: property.name,
        gerk: property.gerk,
        description: property.description
      }).then(function(newProperty) {
        result = {
          success: true,
          message: "OK",
          property: newProperty
        };
        callback(result);
      })
    });
  },
  insertAnimalForUser: function(animal) {
    return new Promise(function(callback) {
      Animal.create({
        userId: animal.userId,
        name: animal.name,
        birthdate: animal.birthdate,
        description: animal.description,
        alive: animal.alive
      }).then(function(newAnimal) {
        result = {
          success: true,
          message: "OK",
          animal: newAnimal
        };
        callback(result);
      })
    });
  },
}
