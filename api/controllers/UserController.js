/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  signUp : signUpAction,
  login : loginAction
};

function signUpAction(req, res){
 if (!req.form.isValid) {
   // send a failed response with error messages
   var validationErrors = ValidationService
     .getValidationErrors(req.form.getErrors());
   return res.failed(validationErrors);
 }

  User
    .registerUser(req.form)
    .then(function(userDetails){

      return res.Success(userDetails);
    })
    .catch(function(error){
      sails.log.error('UserController#signUpAction ::error :', error);
      return res.badRequest();
    });
}

function loginAction(req, res){
  if (!req.form.isValid) {
    // send a failed response with error messages
    var validationErrors = ValidationService
      .getValidationErrors(req.form.getErrors());
    return res.failed(validationErrors);
  }

   User
     .getUser(req.form)
     .then(function(userDetails){

       var response = AuthenticationService.getAuthenticatedResponse({
         user: userDetails
       });
       return res.Success(response);
     })
     .catch(function(error){
       sails.log.error('UserController#loginAction ::error :', error);
       return res.badRequest();
     });
}
