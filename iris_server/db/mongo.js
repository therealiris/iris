// mongo.js

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/iris_db';
var db;

//Collections Used
var userDb;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, database) {

  assert.equal(null, err);
  exports.users = database.collection('users')
  console.log("Connected successfully to server");
  // database.close();
});