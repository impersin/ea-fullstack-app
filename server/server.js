var express = require('express');
var bodyParser = require('body-Parser');
var path = require('path');
var app = express();
var db = require('./db');
var players = require('./db/models/players');
var matchs = require('./db/models/matchs');


app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});


var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server listening on:' + PORT);
});

