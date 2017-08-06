var user = require('../models/Users.js');
var post = require('../models/Posts.js');
var player = require('../models/Player.js');
var message = require('../models/Message.js');
var db = require('../index.js');
var jwt = require('jsonwebtoken-refresh');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var dateTime = require('node-datetime');
var result = [{'Player Name': 'TAEGYU LEEM', 'Match Location': 'Korea', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '3:1'}, {'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'},
{'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'}, {'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'}, {'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'},
 {'Player Name': 'Terry Leem', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'}];

exports.signUp = function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName; 
  var userid = req.body.userid;
  var password = req.body.password;
  var email = req.body.email;
  var profileImage = '';

  user.find({userid: userid}).then(function(data) {
    if (data.length === 0) {
      bcrypt.hash(password, 10).then(function(hash) {
        user.insertMany([{firstname: firstName, lastname: lastName, userid: userid, password: hash, email: email, profileImage: profileImage}], function(err, data) {
          if (err) { throw err; }
          var token = jwt.sign({userid: userid}, process.env.SECRET_KEY, {expiresIn: 3600});
          
          res.json({success: true, userid: userid, firstName: firstName,
            lastName: lastName, token: token, profileImage: profileImage});
        });

      }) .catch(bcrypt.MISMATCH_ERROR, handleInvalidPassword);

    } else {
      res.status(409).send('ID is already exists');
    }
  });  
};

exports.login = function(req, res) {
  var userid = req.body.userid;
  var password = req.body.password;

  user.find({userid: userid}).then(function(data) {
    if (data.length !== 0) {
      bcrypt.compare(password, data[0].password).then(function(pass) {
        if (pass) {
          var email = data[0].email;
          var firstName = data[0].firstname;
          var lastName = data[0].lastname;
          var profileImage = data[0].profileImage;
          var token = jwt.sign({userid: userid}, process.env.SECRET_KEY, {expiresIn: 3600});
          res.json({success: true, userid: userid, firstName: firstName,
            lastName: lastName, email: email, token: token, profileImage: profileImage});   
        } else {
          console.log('Sorry It doenst match...');
          res.status(400).send('Sorry It doenst match...');
        }
      });
    } else {
      res.sendStatus(404);
    }
  });  
};

exports.signOut = function(req, res) {
  res.send(200);
};

exports.addResult = function(req, res) {
};

exports.retrieve = function(req, res) {
  var userid = req.body.userid;
  var password = req.body.password;
  user.find().then(function(data) {
    res.send(data);
  });  
};

exports.favcon = function(req, res) {
  res.sendStatus(204);
};

exports.getRecords = function(req, res) {
  res.send(result);
};
exports.test = function(req, res) {
  res.status(200).send('Okay Cool you have it');
};

exports.getAllPost = function(req, res) {
  post.find().then(function(data) {
    data.reverse();
    res.json(data);
  });
};

exports.retrieveMessages = function(req, res) {
  message.find().then(function(data) {
    res.status(200).json(data.slice(-40));
  });  
};

exports.getAllPlayer = function(req, res) {
  player.find().then(function(data) {
    res.status(200).json(data);
  });
};

exports.addPost = function(req, res) {
  var newPost = req.body;
  var timeStamp = new Date();
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');
  newPost.timeStamps = [formatted, timeStamp.getTime()];
  post.find().sort( { _id: -1 } ).limit(1).then(function(data) {
    if (data.length === 0) {
      var number = 1;
      newPost.postIndex = number;
      newPost.viewcount = 0;
      newPost.satisfied = 0;
      newPost.neutral = 0;
      newPost.dissatisfied = 0;
      post.insertMany([newPost], function(err, data) {
        if (err) { throw err; }
        res.json(data);
      });
    } else {
      var number = data[0].postIndex + 1;
      newPost.postIndex = number;
      newPost.viewcount = 0;
      newPost.satisfied = 0;
      newPost.neutral = 0;
      newPost.dissatisfied = 0;
      post.insertMany([newPost], function(err, data) {
        if (err) { throw err; }
        res.json(data);
      });  
    }
  });
};

exports.addComment = function(req, res) {
  var newPost = req.body;
  newPost.soccerball = 0;
  newPost.redcard = 0;
  newPost.voterList = [];
  var target = req.params.number;
  var timeStamp = new Date();
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');
  newPost.timeStamps = [formatted, timeStamp.getTime()];
  post.update({ postIndex: target}, { $push: {comments: newPost} }).then(function(data) {
    res.send(data);
  });
};

exports.addViewCount = function(req, res) {
  var target = req.params.number;

  post.update({postIndex: target}, { $inc: { viewcount: 1 }}).then(function(data) {
    post.find({postIndex: target}).then(function(data) {
      res.send(data[0]);
    });
  });
};

exports.addProfileImage = function(req, res) {
  var target = req.body.userid;
  var fileName = req.body.fileName;
  console.log(target, fileName);
  user.update({userid: target}, {profileImage: fileName}).then(function(data) {
    res.json(fileName);
  });
};

exports.addVoteCount = function(req, res) {
  var params = req.params.number.split('+');
  var target = params[0];
  var commenter = params[1];
  var type = params[2];
  
  post.find({postIndex: target}).then(function(data) {
    if (data[0].commenterList.indexOf(commenter) === -1) { //user never vote before
      if (type === 'satisfied') {
        post.update({postIndex: target}, { $inc: { satisfied: 1 }}).then(function(data) {
          post.update({ postIndex: target}, { $push: {commenterList: commenter} }).then(function(data) {
            post.find({postIndex: target}).then(function(data) {
              res.send(data[0]);
            });
          });
        });  
      } else if (type === 'dissatisfied') {
        post.update({postIndex: target}, { $inc: { dissatisfied: 1 }}).then(function(data) {
          post.update({ postIndex: target}, { $push: {commenterList: commenter} }).then(function(data) {
            post.find({postIndex: target}).then(function(data) {
              res.send(data[0]);
            });
          });
        });  
      } else {
        post.update({postIndex: target}, { $inc: { neutral: 1 }}).then(function(data) {
          post.update({ postIndex: target}, { $push: {commenterList: commenter} }).then(function(data) {
            post.find({postIndex: target}).then(function(data) {
              res.send(data[0]);
            });
          });
        });
      } 
    } else {
      res.send(data[0]);
    }
  });
};

exports.addCommentVoteCount = function(req, res) {
  var vote = req.body;
  
  if (vote.type === 'soccerball') {
    post.update({postIndex: vote.postIndex, 'comments.commentIndex': vote.commentIndex}, {$inc: {'comments.$.soccerball': 1}, $push: {'comments.$.voterList': vote.voter } }).then(function(data) {
      post.find().then(function(data) {
        res.send(data);
      });
    });
  } else {
    post.update({postIndex: vote.postIndex, 'comments.commentIndex': vote.commentIndex}, {$inc: {'comments.$.redcard': 1}, $push: {'comments.$.voterList': vote.voter } }).then(function(data) {
      res.send(data);
    });
  }
  
};

exports.deletePost = function(req, res) {
  var newPost = req.body;
  var target = req.params.number;
  post.remove({ postIndex: target}).then(function(data) {
    console.log(data);
    res.send(data);
  });
  res.send(newPost);
};