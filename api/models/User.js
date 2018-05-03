/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 var Q = require('q'),
  uuid = require('node-uuid'),
  md5 = require('md5'),
  crypto = require('crypto');

module.exports = {

  attributes: {
    id :{
      type : 'string'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    isAdmin: {
      type: 'boolean',
      defaultsTo: false
    },
    age: {
      type: 'integer'
    },
    occupation: {
      type: 'string'
    },
    dob: {
      type: 'string'
    },
    salt : {
      type : 'string'
    }
  },

  registerUser : registerUser,
  encryptPassword : encryptPassword,
  generateSalt : generateSalt,
  getUser : getUser
};


function registerUser(user){
  return Q.promise(function(resolve, reject) {

    User
      .findOne({email : user.email})
      .then(function(existingUser){
        if(!existingUser || existingUser == 'undefined'){
          var newUser = {
            firstName : user.firstName,
            lastName : user.lastName,
            dob : user.dob,
            email : user.email,
            password : null,
            age : user.age,
            occupation : user.occupation,
            salt : null
          };

          user.salt = generateSalt();

          encryptPassword(user.password, user.salt)
            .then(function(encryptedPassword){
              user.password = encryptedPassword;
              User
                .create(user)
                .then(function(userRegistered){
                  return resolve(userRegistered);
                })
                .catch(function(error){
                  sails.log.error('User#registerUser :: error : ', error);
                  return reject(error);
                });
            })
            .catch(function(error){
              sails.log.error('User#registerUser :: error : ', error);
              return reject(error);
            });
        }else{
          return reject({
            code : 400,
            message : 'USER_ALREADY_EXISTS'
          });
        }
      })
      .catch(function(error){
        sails.log.error('User#registerUser :: error : ', error);
        return reject(error);
      });
  });
}

function encryptPassword(password, salt) {
  return Q.promise(function(resolve, reject) {

    crypto.pbkdf2(password, salt, 10, 512, 'sha512', function(err, encrypted) {
      if (err) {
        return reject(err);
      }
      return resolve(encrypted.toString('hex'));
    });
  });
}

function generateSalt() {
  return md5(uuid.v1());
}

function getUser(loginDetails){
  return Q.promise(function(resolve, reject) {
    User
      .findOne({
        email : loginDetails.email
      })
      .then(function(user){
        if(!user || user == 'undefined'){
          return reject({
            code : 404,
            message : 'USER_WITH_EMAIL_NOT_FOUND'
          });
        }
        encryptPassword(loginDetails.password, user.salt)
          .then(function(password){
            if(password === user.password){
              var userDetails = {
                email : user.email,
                id : user.id,
                firstName : user.firstName,
                lastName : user.lastName,
                occupation : user.occupation,
                age : user.age
              };

              if(user.isAdmin === true){
                getAllUsers()
                  .then(function(allOtherUsers){
                    var responseObject = {
                      userDetails : userDetails,
                      otherUsers : allOtherUsers
                    };

                    return resolve(responseObject);
                  })
                  .catch(function(error){
                    sails.log.error('User#getUser :: error : ', error);
                    return reject(error);
                  });
              }
            }
            else{
              return reject({
                code : 401,
                message : 'WRONG_PASSWORD_TRY_AGAIN'
              });
            }
          })
          .catch(function(error){
            sails.log.error('User#getUser :: error : ', error);
            return reject(error);
          });
      })
      .catch(function(error){
        sails.log.error('User#getUser :: error : ', error);
        return reject(error);
      });
  });
}

function getAllUsers(){
  return Q.promise(function(resolve, reject) {
    User
      .find()
      .then(function(allUsers){
        var formattedUsers = [];
        _.forEach(allUsers, function(user){
          var eachUser = {
            email : user.email,
            id : user.id,
            firstName : user.firstName,
            lastName : user.lastName,
            occupation : user.occupation,
            age : user.age
          };
          formattedUsers.push(eachUser);
        });

        return resolve(formattedUsers);
      })
      .catch(function(){
        sails.log.error('User#getAllUsers :: error : ', error);
        return reject(error);
      });
  });
}
