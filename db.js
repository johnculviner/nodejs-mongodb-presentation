var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports.connect = function connect() {

  mongoose.connect('mongodb://localhost/nodejs-mongodb-presentation');

  mongoose.connection.on('open', () => {
    console.log('mongoose connected!');
  });
};