var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  playername: String,
  location: String,
  duration: String,
  playerteam: String,
  opponent: String,
  result: String,
  score: String
   
});
 
var Match = mongoose.model('Match', userSchema);
 
module.exports = Match;

// var db = require('../index.js');

// var sql = `CREATE TABLE IF NOT EXISTS matchs (
//   id int(100) NOT NULL AUTO_INCREMENT,
//   duration int(200) NOT NULL,
//   location varchar(100) NOT NULL,
//   win_team varchar(100) NOT NULL,
//   lose_team varchar(100) NOT NULL,
//   score varchar(100) NOT NULL,
//   winner_id int(100) NOT NULL,
//   PRIMARY KEY(ID),
//   FOREIGN KEY (winner_id) REFERENCES players(id))`;
// db.query(sql, function (err, result) {
//   if (err) { throw err; }
//   console.log('match table is created');
// });   




