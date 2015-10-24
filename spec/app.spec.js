//npm install mocha -S
//npm install chai -S
//npm install uuid -S
//npm install request-json -S

var uuid = require('uuid');
var app = require('../app');
var Promise = require('bluebird');
var client = require('request-json').createClient('http://localhost:3000/');
Promise.promisifyAll(client);
var expect = require('chai').expect;
var mongoose = require('mongoose');

describe('app integration test', function () {

  before(() => app.start(uuid.v4()));

  var testObj = {
    url : 'foo.com/bar',
    title : 'cool page',
    widgets : [
      { type: 'radar', zipCode: 55410 }
    ]
  };

  var objId;

  it('PUT obj w/o failure', () => {
    return client.putAsync('/pages', testObj)
      .spread((resp, body) => {
        objId = body._id;
        expect(body.url).to.equal('foo.com/bar');
      });
  });

  it('GET obj by id', () => {
    return client.getAsync('/pages/'+ objId)
      .spread((resp, body) => {
        expect(body.url).to.equal('foo.com/bar');
      });
  });

  it('GET all by id', () => {
    return client.getAsync('/pages')
      .spread((resp, body) => {
        expect(body[0].url).to.equal('foo.com/bar');
      });
  });

  after(() => mongoose.connection.db.dropDatabase());

});