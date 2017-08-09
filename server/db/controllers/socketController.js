var message = require('../models/Message.js');
var db = require('../index.js');
var jwt = require('jsonwebtoken');
var io = require('../../server.js');

exports.getMessage = function(socket) {
  message.find().then(function(data) {
    socket.emit('connection', data);
  });
};

exports.addMessage = function(newMesaage) {
  newMesaage.userid = newMesaage.userid;
  newMesaage.avatar = newMesaage.avatar;
  newMesaage.message = newMesaage.text;
  newMesaage.timeStamps = [];
  message.find().sort( { _id: -1 } ).limit(1).then
  (function(data) {
    if (data.length === 0) {
      var number = 1;
      newMesaage.messageIndex = number;
      newMesaage.timeStamps = [];
      message.insertMany([newMesaage], function(err, data) {
        if (err) { throw err; }
        io.io.sockets.emit('newmsg', data);
      });
    } else {
      var number = data[0].messageIndex + 1;
      newMesaage.messageIndex = number;
      message.insertMany([newMesaage], function(err, data) {
        if (err) { throw err; }
        message.find().then(function(data) {
          io.io.sockets.emit('newmsg', data.slice(-40));
        });
      });  
    }
  });
};