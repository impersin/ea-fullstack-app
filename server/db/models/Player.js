var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: String,
  country: String,
  club: String,
  rank: Number,
  data: Array,
  images: Object
});
 
var Player = mongoose.model('Player', playerSchema);
 
module.exports = Player;