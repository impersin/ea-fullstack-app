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

app.get('/api/record', function(req, res) {
  var query = 'SELECT p.name "Player Name", m.location "Match Location", m.duration "Match Duration", m.win_team "Win Team" ,m.lose_team "Lose Team", m.score "Final Score" FROM players p INNER JOIN matchs m ON p.id = m.winner_id';
  db.query(query, function(err, results, fiedls) {
    var data = JSON.stringify(results);        
    res.send(data);
  });
        
});    


var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server listening on:' + PORT);
});

