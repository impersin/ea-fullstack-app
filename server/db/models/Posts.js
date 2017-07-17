var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
  postIndex: Number,
  userid: String,
  title: String,
  text: String,
  comments: Array,
  commenterList: Array,
  timeStamps: Array,
  satisfied: Number,
  neutral: Number,
  dissatisfied: Number, 
  viewcount: Number, 
});
 
var Post = mongoose.model('Post', postSchema);
 
module.exports = Post;