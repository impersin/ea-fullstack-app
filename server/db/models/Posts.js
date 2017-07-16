var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
  postIndex: Number,
  userid: String,
  title: String,
  text: String,
  comments: Array,
  timeStamps: Array  
});
 
var Post = mongoose.model('Post', postSchema);
 
module.exports = Post;