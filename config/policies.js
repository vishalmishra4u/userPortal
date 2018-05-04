/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  UserController : {
    'signUp': ['userValidation/registerValidation'],
    'login': ['userValidation/loginValidation'],
    'deleteUser': ['isUserAuthenticated','userValidation/userDeleteValidation','isAdmin'],
    'updateUser': ['isUserAuthenticated','userValidation/updateUserValidation']
  }
};
