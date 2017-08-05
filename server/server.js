var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./db');
var controller = require('./db/controllers/controller.js');
var socketController = require('./db/controllers/socketController.js');
var s3Controller = require('./db/controllers/s3controller.js');
var app = express();
var secureRoutes = express.Router();
var multiparty = require('connect-multiparty');
var cookieParser = require('cookie-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var multipartyMiddleware = multiparty();
var AWS = require('aws-sdk');
var isDeveloping = process.env.NODE_ENV !== 'production';
var jwt = require('jsonwebtoken-refresh');
require('dotenv').config();

if (!isDeveloping) {
  AWS.config.update({
    accessKeyId: process.env.S3_KEY, 
    secretAccessKey: process.env.S3_SECRET, 
    region: process.env.S3_REGION
  });
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multipartyMiddleware);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../client')));
app.use('/secure-api', secureRoutes);

app.get('/', function(req, res) {
  res.send(200);
});

io.on('connection', function(socket) {
  socketController.getMessage(socket);
  console.log('Socket.io is GO');

  socket.on('add-customer', function(customer) {
    console.log('Customer added', customer); 
  });

  socket.on('notification', function(data) {
    console.log('NEW CUSTOMER IN THE QUEUE', data);
  });
  socket.on('newMessage', function(data) {
      //Send message to everyone
    console.log('new message comming');
    socketController.addMessage(data);
  });

});

app.get('/favicon.ico', controller.favcon);
app.post('/api/signUp', controller.signUp);
app.post('/api/upload/File', s3Controller);
app.get('/api/users', controller.retrieve);
app.post('/api/login', controller.login);
app.get('/api/signout', controller.signOut);
app.get('/api/record', controller.getRecords);
app.get('/api/post', controller.getAllPost);
app.get('/api/player', controller.getAllPlayer);
app.put('/api/post/viewcount/:number', controller.addViewCount);



secureRoutes.use(function(req, res, next) {
  var token = req.body.token || req.headers.token;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function(err, decode) {
      if (err) {
        res.status(500).send('Invalid Token');
      } else {
        next();//This pass to next matching pass 
      }
    });
  } else {
    res.send('Dude.. get a token');
  }
});

secureRoutes.get('/checkRequest', controller.test);
secureRoutes.post('/record', controller.addResult);
secureRoutes.post('/post/add', controller.addPost);
secureRoutes.post('/post/add/profile/image', controller.addProfileImage);
secureRoutes.delete('/post/delete/:number', controller.deletePost);
secureRoutes.post('/post/upload/file', s3Controller);
secureRoutes.put('/update/add/comment/:number', controller.addComment);
secureRoutes.put('/update/add/vote/:number', controller.addVoteCount);
secureRoutes.post('/update/add/comment/vote', controller.addCommentVoteCount);

var port = process.env.PORT || 9000;
// /secure-api/checkRequest
server.listen(port, function() {
  console.log('Listening Port:9000');
});

exports.io = io;