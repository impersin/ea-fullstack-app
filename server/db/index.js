var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/eaApp';

mongoose.connect(mongoUri);

var db = mongoose.connection;

var importData = require('./users.json');
var User = require('./models/Users.js');  

db.once('open', () => {
  console.log('database connected!');
});

module.exports = db;

// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'EA'
// });

// module.exports = con;