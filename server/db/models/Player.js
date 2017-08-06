var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: String,
  country: String,
  club: String,
  position: String,
  rank: Number,
  overall: Number,
  datatype: Object,
  data: Array,
  images: Object
});
 
var Player = mongoose.model('Player', playerSchema);
 
module.exports = Player;