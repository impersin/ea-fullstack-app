var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
  messageIndex: Number,
  userid: String,
  message: String,
  timeStamps: Array, 
});
 
var Message = mongoose.model('Message', messageSchema);
 
module.exports = Message;