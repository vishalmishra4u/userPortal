/*
*Library for storing and editing data
*/

var fs = require('fs'),
  path = require('path'),
  Q = require('q'),
  _ = require('lodash');

var baseDir = path.join(__dirname,'/../');

function createData(dir, file, data){
  return Q.promise(function(resolve, reject){
    // Open the file for writing
    fs.open(baseDir+dir+'/'+file+'.json','wx',function(err, fileDescriptor){
      if(!err && fileDescriptor){
        var stringData = JSON.stringify(data);

        //write to file and close it
        fs.writeFile(fileDescriptor, stringData, function(err){
          if(!err){
            fs.close(fileDescriptor, function(err){
              if(!err){
                return resolve();
              }
              else{
                return reject({
                  code : 400,
                  message : 'BAD_REQUEST'
                });
              }
            });
          }else{
            return reject({
              code : 400,
              message : 'ERROR_WRITING_NEW_FILE'
            });
          }
        });
      }else{
        return reject({
          code : 400,
          message : 'COULD_NOT_CREATE_NEW_FILE_MAY_ALREADY_EXIST'
        });
      }
    });
  });
}

//Read data from the file
function readData(dir, file){
  return Q.promise(function(resolve, reject){
    fs.readFile(baseDir+dir+'/'+file+'.json','utf8',function(err, data){
      if(!err && data){
        var parsedData = parseJsonToObject(data);
        return resolve(parsedData);
      }
      else{
        return reject({
          code : 400,
          message : 'BAD_REQUEST'
        });
      }
    });
  });
};

//Get all user data
function getAllUsers(dir, adminEmail){
  return Q.promise(function(resolve, reject) {

    listData(dir)
      .then(function(allUsers){

        var nonAdminUsers = _.difference(allUsers, [adminEmail]);

        var nonAdminUserDetails = [];
        _.forEach(nonAdminUsers, function(nonAdminUser){
          nonAdminUserDetails.push(readData('userData', nonAdminUser));
        });

        return Q.all(nonAdminUserDetails)
          .then(function(nonAdminUserDetails){

            return resolve(nonAdminUserDetails);
          });
      })
      .catch(function(error){
        return reject({
          code : 400,
          message : 'BAD_REQUEST'
        });
      });
  });
}

//parse a json string to an object in all cases
function parseJsonToObject(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  }catch(e){
    return {};
  }
}

function updateData(dir, file, data){
  return Q.promise(function(resolve, reject) {
    fs.open(baseDir+dir+'/'+file+'.json','r+', function(err, fileDescriptor){
      if(!err && fileDescriptor){
        //Convert data to string
        var stringData = JSON.stringify(data);

        //Truncate the file
        fs.truncate(fileDescriptor, function(err){
          if(!err){
            //Write to the file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
              if(!err){
                fs.close(fileDescriptor, function(err){
                  if(!err){
                    return resolve();
                  }
                  else{
                    return reject({
                      code : 400,
                      message : 'ERROR_CLOSING_EXISTING_FILE'
                    });
                  }
                });
              }else{
                return reject({
                  code : 400,
                  message : 'ERROR_WRITING_TO_EXISTING_FILE'
                });
              }
            });
          }
          else{
            return reject({
              code : 400,
              message : 'ERROR_TRUNCATING_FILE'
            });
          }
        });
      }
      else{
        return reject({
          code : 400,
          message : 'COULD_NOT_OPEN_FILE_MAY_NOT_EXIST'
        });
      }
    });
  });
}

//Delete a file
function deleteData(dir, file){
  return Q.promise(function(resolve, reject) {
    //unlink the file
    fs.unlink(baseDir+dir+'/'+file+'.json', function(err){
      if(!err){
        return resolve();
      }
      else{
        return reject({
          code : 400,
          message : 'ERROR_DELETING_FILE'
        });
      }
    });
  });
}

// List all the items in a directory
function listData(dir){
  return Q.promise(function(resolve, reject) {
    fs.readdir(baseDir+dir+'/', function(err,data){
      if(!err && data && data.length > 0){
        var trimmedFileNames = [];
        data.forEach(function(fileName){
          trimmedFileNames.push(fileName.replace('.json',''));
        });
        return resolve(trimmedFileNames);
      } else {
        return reject({
          code : 400,
          message : 'BAD_REQUEST'
        });
      }
    });
  });
};

//Export the module
module.exports = {
  listData : listData,
  createData : createData,
  updateData : updateData,
  deleteData : deleteData,
  readData : readData,
  getAllUsers : getAllUsers
};
