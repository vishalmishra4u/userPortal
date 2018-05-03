'use strict';

var _ = require('lodash');

module.exports = function(req, res, next) {
  var email = req.param('adminEmail');

  //Get admin details of user
  fileStorage
    .readData('userData',email)
    .then(function(userDetail){
      //Check is the user isAdmin
      if(userDetail.isAdmin === true){
        return next();
      }else{
        return res.badRequest({
          code : 401,
          message : 'NOT_ADMIN'
        });
      }
    })
    .catch(function(error){
      sails.log.error('isAdmin :: Error :', error);
      return res.badRequest(error);
    });
};
