'use strict';

var _ = require('lodash');

module.exports = function(req, res, next) {
  // check if the request has header
  // if header is present; check the token validity
  // if token is valid; call next
  // if token is not valid; send a 403 response
  var authToken = req.headers['authorization'];
  if (_.isUndefined(authToken)) {
    var err = {
      code: 401,
      message: 'USER_AUTHENTICATION_ERROR'
    };

    LoggingService.logErrorInfo(req, 'User Authentication', 'IsUserAuthenticated','User Authentication Failure - Undefined Token');
    return res.handleError(err);
  }
  AuthenticationService
    .validateToken(authToken)
    .then(function(user) {

      return next();
    }, function(err) {
      sails.log.error('#IsUserAuthenticated :: Error while validating the ' +
        'token :: ', err);

      return res.badRequest();
    });
};
