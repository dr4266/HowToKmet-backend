module.exports = function(request) {
  return new Promise(function(callback) {
    //regular expression for email testing
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum|si)\b/;
    let body = request.body;
    result = {};
    result.success = false;
    if (!body) {
      result.message = "Please specify a body with the required parameters."
    } else if (!body.firstName || !body.lastName || !body.username || !body.email ||
        !body.password) {
      result.message = "Please make sure you have all the required fields."
    } else if (body.firstName.length < 2 || body.firstName.length > 64) {
      result.message = "firstName is too short/long (should be 2-64 characters)"
    } else if (body.lastName.length < 2 || body.lastName.length > 64) {
      result.message = "lastName is too short/long (should be 2-64 characters)"
    } else if (body.username.length < 4 || body.username.length > 64) {
      result.message = "Username is too short/long (should be 4-64 characters)"
    } else if (body.password.length < 8 || body.password.length > 64) {
      result.message = "Password is too short/long (should be 8-64 characters)"
    } else if (body.email.length < 5 || body.email.length > 64
       || !re.test(body.email)) {
      result.message = "Email is invalid (5-64 characters, username@domain.com)."
    } else {
      result.success = true;
      result.message = "OK";
    }
    callback(result);
  });
}
