'use strict';

var _ = require('lodash');

module.exports = function(req, res, next) {
  var email = req.param('adminEmail');

  fileStorage
    .readData('userData',email)
    .then(function(userDetail){
      if(userDetail.isAdmin === true){
        return next();
      }else{
        return res.badRequest();
      }
    })
};
