angular.module('eaApp.Home', [])
.controller('HomeController', function($scope, Factory) {
  $scope.title = 'FIFA 2018 Match Result Page';
  $scope.matchInfo = {
    playerName: '',
    location: '',
    duration: 0,
    playerTeam: '',
    opponent: '',
    result: '',
    score: ''
  };

  Factory.getAll().then(function(res) {
    $scope.matchResults = res.data;
    $scope.matchResults.forEach(function(match) {
      var score1 = parseInt(match['Final Score'][0]);
      var score2 = parseInt(match['Final Score'][2]);
      if (score1 > score2) {
        match['Final Score'] += ' WON';
      } else {
        match['Final Score'] += ' LOST';
      }
    }, this);
  });

  $scope.sendRecord = function() {
    Factory.addRecord($scope.matchInfo).then(function(res) {
      console.log('Successfully Added');
      Factory.getAll().then(function(res) {
        $scope.matchResults = res.data;
        $scope.matchResults.forEach(function(match) {
          var score1 = parseInt(match['Final Score'][0]);
          var score2 = parseInt(match['Final Score'][2]);
          if (score1 > score2) {
            match['Final Score'] += ' WON';
          } else {
            match['Final Score'] += ' LOST';
          }
        }, this);  
        $scope.matchInfo = {
          playerName: '',
          location: '',
          duration: 0,
          playerTeam: '',
          opponent: '',
          result: '',
          score: ''
        };
      });
    });
  };

});