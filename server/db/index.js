var mongoose = require('mongoose');
var Player = require('./models/Player.js');
var playerData = require('../data/playerData.json');

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/eaApp';

mongoose.connect(mongoUri);

var db = mongoose.connection;


db.once('open', () => {
  console.log('database connected!');
});

//insert data only once!!

Player.find().then(function(data) {
  if (data.length === 0) {
    Player.insertMany(playerData).then(function(res) {
      console.log(res);
    });  
  }
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