/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  signUp : signUpAction,
  login : loginAction,
  deleteUser : deleteUserAction,
  updateUser : updateUserAction
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
    .then(function(){

      return res.Success();
    })
    .catch(function(error){
      sails.log.error('UserController#signUpAction ::error :', error);
      return res.handleError(error);
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
       return res.handleError(error);
     });
}

function deleteUserAction(req, res){
  var deleteUserEmail = req.param('email');
  User
    .removeUser(deleteUserEmail)
    .then(function(){
      return res.Success();
    })
    .catch(function(error){
      sails.log.error('UserController#deleteUserAction ::error :', error);
      return res.handleError(error);
    });
}

function updateUserAction(req, res){
  if (!req.form.isValid) {
    // send a failed response with error messages
    var validationErrors = ValidationService
      .getValidationErrors(req.form.getErrors());
    return res.failed(validationErrors);
  }

   User
     .updateUser(req.form)
     .then(function(){

       return res.Success();
     })
     .catch(function(error){
       sails.log.error('UserController#updateUserAction ::error :', error);
       return res.handleError(error);
     });
}
