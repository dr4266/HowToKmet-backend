var moment = require('moment');

module.exports = function(request) {
  return new Promise(function(callback) {
    let body = request.body;
    result = {};
    result.success = false;
    if (null == body) {
      result.message = "Please specify a body with the required parameters.";
    } else if (null == body.name || null == body.description || null == body.taskResource ||
      body.taskType == null) {
      result.message = "Please make sure you have all the required fields.";
    } else if (body.name.length < 2 || body.name.length > 128) {
      result.message = "Name is too short/long (should be 2-128 characters)";
    } else if (body.taskType.length < 2 || body.taskType.length > 64) {
      result.message = "taskType is too short/long (should be 2-64 characters)";
    } else if (body.description.length > 512) {
      result.message = "description is too long (should be 0-512 characters)";
    } else if (body.taskResource.length < 2 || body.taskResource.length > 64) {
      result.message = "taskResource is too short/long (should be 2-64 characters)";
    } else if (body.date) {
      var date = moment(body.date, 'DD/MM/YYYY');
      if (null == date.isValid() || date == null) {
        result.success = false;
        result.message = "Please use a standard for the date parameter"
      } else {
        result.success = true;
        result.message = "OK"
      }
    } else {
      result.success = true;
      result.message = "OK";
    }
    callback(result);
  });
}
