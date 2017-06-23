var express = require('express');
var bodyParser = require('body-Parser');
var path = require('path');
var app = express();
var db = require('./db');
var players = require('./db/models/players');
var matchs = require('./db/models/matchs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client')));


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

app.post('/api/record', function(req, res) {
  var playerIdQuery = `SELECT id from players where name = "${req.body.playerName}"`; 
  if (req.body.result === 'win') {
    var win = 1;
    var lose = 0;
    db.query(playerIdQuery, function(err, results, fiedls) {
      if (err) { throw err; }
      var playerId = results[0];
      if (!playerId) {
        var query = `INSERT INTO players (name, win, lose) VALUES("${req.body.playerName}", ${win}, ${lose})`;   
        db.query(query, function(err, results, fiedls) {
          if (err) { throw err; }
          var matchQuery = `INSERT INTO matchs (duration, location, win_team, lose_team, score, winner_id) VALUES("${req.body.duration}", "${req.body.location}", "${req.body.playerTeam}", "${req.body.opponent}","${req.body.score}", ${parseInt(results.insertId)})`;
          db.query(matchQuery, function(err, results, fiedls) {
            if (err) { throw err; }
            res.send(200);
          });
        });
        
      } else {  
        var matchQuery = `INSERT INTO matchs (duration, location, win_team, lose_team, score, winner_id) VALUES("${req.body.duration}", "${req.body.location}", "${req.body.playerTeam}", "${req.body.opponent}", "${req.body.score}", ${parseInt(playerId.id)} )`;
        var query = `UPDATE players SET win = win + 1 WHERE id = ${parseInt(playerId.id)}`;
        db.query(query, function(err, results, fiedls) {   
          if (err) { throw err; }
          db.query(matchQuery, function(err, results, fiedls) {
            if (err) { throw err; }
            res.send(200);
          });
        });
      }
    });  
  } else {

    var win = 0;
    var lose = 1;
    db.query(playerIdQuery, function(err, results, fiedls) {
      if (err) { throw err; }
      var playerId = results[0];
      if (!playerId) {
        var query = `INSERT INTO players (name, win, lose) VALUES("${req.body.playerName}", ${win}, ${lose})`;   
        db.query(query, function(err, results, fiedls) {
          if (err) { throw err; }
          var matchQuery = `INSERT INTO matchs (duration, location, win_team, lose_team, score, winner_id) VALUES("${req.body.duration}", "${req.body.location}", "${req.body.playerTeam}", "${req.body.opponent}","${req.body.score}", ${parseInt(results.insertId)})`;
          db.query(matchQuery, function(err, results, fiedls) {
            if (err) { throw err; }
            res.send(200);
          });  
        });


      } else {  
        var matchQuery = `INSERT INTO matchs (duration, location, win_team, lose_team, score, winner_id) VALUES("${req.body.duration}", "${req.body.location}", "${req.body.playerTeam}", "${req.body.opponent}", "${req.body.score}", ${parseInt(playerId.id)} )`;
        var query = `UPDATE players SET lose = lose + 1 WHERE id = ${parseInt(playerId.id)}`; 
        db.query(query, function(err, results, fiedls) {  
          if (err) { throw console.log('here'); }
          db.query(matchQuery, function(err, results, fiedls) {
            if (err) { throw err; }
            res.send(200);
          });  
        });

      }
    });
  }
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server listening on:' + PORT);
});

