var _ = require('lodash'),
  jwt = require('jsonwebtoken'),
  conf = sails.config,
  secret = conf.session.secret,
  Q = require('q');

module.exports = {
  generateToken: generateToken,
  getAuthenticatedResponse: getAuthenticatedResponse,
  validateToken: validateToken
};

function generateToken(user) {
  // check user and return
  if (!user) {
    return null;
  }
  // generate a user id and authenticate
  var payload = {
    userInfo: user.id
  };
  // return token and user information with a refresh token
  var options = {expiresIn: '1h'};

  return jwt.sign(payload, secret, options);
}

function getAuthenticatedResponse(userAndProfile) {

  if (!userAndProfile) {
    return null;
  }

  var user = userAndProfile.user;

  // remove the system unique key
  if (_.has(user, "systemUniqueKey")) {
    delete user.systemUniqueKey;
  }

  return {
    user: user,
    token: AuthenticationService.generateToken(user)
  };
}

/**
 * Validates the authentication token and fetches the user from db
 *
 * @param authToken
 */
function validateToken(authToken) {
  var authPayload;
  return Q.promise(function(resolve, reject) {
    // validate the token
    try {
      // decode the token
      authPayload = jwt.verify(authToken, secret);
    } catch (err) {
      sails.log.error('AuthenticationService#validateToken :: Error while ' +
        'verifying the token :: ', err);

      return reject({
        code: 401,
        message: 'USER_INVALID_AUTH'
      });
    }

    // check if payload is an object
    if (_.isUndefined(authPayload) || !authPayload) {
      sails.log.error('AuthenticationService#validateToke :: Unidentified ' +
        'payload :: ', authPayload);

      return reject({
        code: 401,
        message: 'USER_INVALID_AUTH'
      });
    }
    var userId = authPayload.userInfo;

  });
}
