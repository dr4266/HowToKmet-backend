var moment = require('moment');

module.exports = function(request) {
  return new Promise(function(callback) {
    let body = request.body;
    result = {};
    result.success = false;
    result.message = "No valid parameter for update";
    if (null == body || Object.keys(body).length === 0 && body.constructor === Object) {
      result.success = false;
      result.message = "Please specify a body with parameters you would like to update.";
    }
    if (body.name != null) {
      result.success = true;
      if (body.name.length < 2 || body.name.length > 128) {
        result.success = false;
        result.message = "Name is too short/long (should be 2-128 characters)";
      }
    }
    if (body.description != null) {
      result.success = true;
      if (body.description.length > 512) {
        result.success = false;
        result.message = "description is too long (should be 0-512 characters)";
      }
    }
    if (body.taskType != null) {
      result.success = true;
      if (body.taskType.length < 2 || body.taskType.length > 64) {
        result.success = false;
        result.message = "taskType is too short/long (should be 2-64 characters)";
      }
    }
    if (body.taskResource != null) {
      result.success = true;
      if (body.taskResource.length < 2 || body.taskResource.length > 64) {
        result.success = false;
        result.message = "taskResource is too short/long (should be 2-64 characters)";
      }
    }
    if (body.date) {
      result.success = true;
      var date = moment(body.date, 'DD/MM/YYYY');
      if (null == date.isValid() || date == null) {
        result.success = false;
        result.message = "Please use a standard for the date parameter"
      }
    }
    if (result.success) {
      result.message = "OK";
    }
    callback(result);
  });
}
