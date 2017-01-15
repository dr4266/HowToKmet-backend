var moment = require('moment');

module.exports = function(request) {
  return new Promise(function(callback) {
    let body = request.body;
    result = {};
    result.success = false;
    if (!body) {
      result.message = "Please specify a body with the required parameters.";
    } else if (!body.name || !body.gerk) {
      result.message = "Please make sure you have all the required fields.";
    } else if (body.name.length < 2 || body.name.length > 64) {
      result.message = "Name is too short/long (should be 2-64 characters)";
    } else if (body.gerk.length < 2 || body.gerk.length > 64) {
      result.message = "GERK should not be that short / long (should be 2-64 characters)";
    } else if (body.description) {
        if (body.description.length > 512) {
          result.success = false;
          result.message = "Description is too long, please limit it to 512 characters"
        } else {
          result.success = true;
          result.message = "OK";
        }
    } else {
      result.success = true;
      result.message = "OK";
    }
    callback(result);
  });
}
