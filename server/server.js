var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./db');
var controller = require('./db/controllers/controller.js');
var app = express();
var jwt = require('jsonwebtoken');
var secureRoutes = express.Router();
var cookieParser = require('cookie-parser');

process.env.SECRET_KEY = 'mybadasskey';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../client')));
app.use('/secure-api', secureRoutes);

app.get('/', function(req, res) {
  res.send(200);
});
app.get('/favicon.ico', controller.favcon);
app.post('/api/signUp', controller.signUp);
app.get('/api/users', controller.retrieve);
app.post('/api/login', controller.login);
app.get('/api/signout', controller.signOut);
app.get('/api/record', controller.getRecords);
app.get('/api/post', controller.getAllPost);


secureRoutes.use(function(req, res, next) {
  var token = req.body.token || req.headers.token;
  // console.log('token:', token);
  // console.log(req);
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
secureRoutes.put('/post/add/comment/:number', controller.addComment);
secureRoutes.put('/post/add/viewcount/:number', controller.addViewCount);

// /secure-api/checkRequest
app.listen(9000, function() {
  console.log('Listening Port:9000');
});
