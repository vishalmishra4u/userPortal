/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'POST /user/signUp': {
    controller: 'UserController',
    action : 'signUp'
  },
  'GET /user/login': {
    controller: 'UserController',
    action : 'login'
  },
  'DELETE /user/deleteUser': {
    controller: 'UserController',
    action : 'deleteUser'
  },
  'PUT /user/update': {
    controller: 'UserController',
    action : 'updateUser'
  }

};
