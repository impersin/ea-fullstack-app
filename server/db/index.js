var mongoose = require('mongoose');
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/eaApp';

mongoose.connect(mongoUri);

var db = mongoose.connection;

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