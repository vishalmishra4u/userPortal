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
      type : 'string',
      required : true
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
  getUser : getUser,
  removeUser : removeUser,
  updateUser : updateUser
};


function registerUser(user){
  return Q.promise(function(resolve, reject) {

    var newUser = {
      firstName : user.firstName,
      lastName : user.lastName,
      id : generateSalt(),
      dob : user.dob,
      email : user.email,
      password : null,
      age : user.age,
      occupation : user.occupation,
      salt : null,
      isAdmin : false
    };

    newUser.salt = generateSalt();

    encryptPassword(user.password, newUser.salt)
      .then(function(encryptedPassword){
      newUser.password = encryptedPassword;

      //Send the data and call createData of fileStorgae service to store data
      fileStorage
        .createData('userData',user.email,newUser)
        .then(function(userRegistered){
          return resolve();
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
    fileStorage.readData('userData',loginDetails.email)
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
                getAllUsers(user.email)
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
              }else{
                return resolve(userDetails);
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

function getAllUsers(adminEmail){
  return Q.promise(function(resolve, reject) {
    fileStorage.getAllUsers('userData', adminEmail)
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

function removeUser(userEmail){
  return Q.promise(function(resolve, reject) {
    fileStorage
      .deleteData('userData',userEmail)
      .then(function(){
        return resolve();
      })
      .catch(function(error){
        sails.log.error('User#removeUser :: error : ', error);
        return reject(error);
      });
  });
}

function updateUser(userDetails){
  return Q.promise(function(resolve, reject) {
    fileStorage
      .readData('userData', userDetails.email)
      .then(function(userData){

        userData.firstName = userDetails.firstName || userData.firstName ;
        userData.lastName = userDetails.lastName || userData.lastName ;
        userData.age = userDetails.age || userData.age ;
        userData.dob = userDetails.dob || userData.dob ;
        userData.occupation = userDetails.occupation || userData.occupation ;

        fileStorage
          .updateData('userData', userDetails.email, userData)
          .then(function(){

            return resolve();
          })
          .catch(function(error){
            sails.log.error('User#updateUser :: error : ', error);
            return reject(error);
          });
      })
      .catch(function(error){
        sails.log.error('User#updateUser :: error : ', error);
        return reject(error);
      });
  });
}
