var user = require('../models/Users.js');
var match = require('../models/Matchs.js');
var post = require('../models/Posts.js');
var db = require('../index.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');

var result = [{'Player Name': 'TAEGYU LEEM', 'Match Location': 'Korea', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '3:1'}, {'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'},
{'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'}, {'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'}, {'Player Name': 'TAEGYU LEEM', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'},
 {'Player Name': 'Terry Leem', 'Match Location': 'Japan', 'Match Duration': 90, 'Win Team': 'Korea', 'Lose Team': 'Japan', 'Final Score': '2:0'}];

exports.signUp = function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName; 
  var userid = req.body.userid;
  var password = req.body.password;
  var email = req.body.email;

  user.find({userId: userid}).then(function(data) {
    if (data.length === 0) {
      bcrypt.hash(password, 10).then(function(hash) {
        user.insertMany([{firstname: firstName, lastname: lastName, userid: userid, password: hash, email: email}], function(err, data) {
          if (err) { throw err; }
          var token = jwt.sign({userid: userid, password: password}, process.env.SECRET_KEY, {expiresIn: 4000});
          
          res.json({success: true, userid: userid, firstName: firstName,
            lastName: lastName, token: token});
        });

      }) .catch(bcrypt.MISMATCH_ERROR, handleInvalidPassword);

    } else {
      res.sendStatus(409);
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
          var token = jwt.sign({userid: userid, password: password}, process.env.SECRET_KEY, {expiresIn: 4000});
          console.log('Welcome!');
          res.json({success: true, userid: userid, firstName: firstName,
            lastName: lastName, email: email, token: token});   
        } else {
          console.log('Sorry It doenst match...');
          res.sendStatus(401);   
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

exports.addPost = function(req, res) {
  var newPost = req.body;
  console.log(newPost);
  var timeStamp = new Date();
  newPost.timeStamps = [timeStamp, timeStamp.getTime()];
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
  var target = req.params.number;
  var timeStamp = new Date();
  newPost.timeStamps = [timeStamp, timeStamp.getTime()];
  post.update({ postIndex: target}, { $push: {comments: newPost} }).then(function(data) {
    res.send(data);
  });
  res.send(newPost);
};

exports.addViewCount = function(req, res) {
  var target = req.params.number;

  post.update({postIndex: target}, { $inc: { viewcount: 1 }}).then(function(data) {
    post.find({postIndex: target}).then(function(data) {
      res.send(data[0]);
    });
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

exports.deletePost = function(req, res) {
  var newPost = req.body;
  var target = req.params.number;
  post.remove({ postIndex: target}).then(function(data) {
    console.log(data);
    res.send(data);
  });
  res.send(newPost);
};