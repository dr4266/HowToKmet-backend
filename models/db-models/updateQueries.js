var dbConfig = require('./dbConfig');
var User = dbConfig.User;
var Task = dbConfig.Task;
var Animal = dbConfig.Animal;
var Property = dbConfig.Property;

module.exports = {
  updateTaskForUser: function(task) {
    return new Promise(function(callback) {
      Task.update(task, {
        where: {id: task.id, userId: task.userId}
      }).then(function(rowsAffected){
        result = {}
        if (rowsAffected > 0) {
          result.success = true;
          result.rows = rowsAffected;
          result.message = "Successfully updated the task."
        } else {
          result.success = false;
          result.rows = rowsAffected;
          result.message = "This user has no such task."
        }
        callback(result);
      });
    });
  },
}
