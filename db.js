var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports.connect = function connect() {

  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost/nodejs-mongodb-presentation');

    mongoose.connection.once('open', () => {
      console.log('mongoose connected!');
      resolve();
    });

    mongoose.connection.on('error', () => {
      reject();
    });
  });
};