var express = require('express');
var bodyParser = require('body-Parser');
var app = express();

app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('hello');
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server listening on:' + PORT);
});
