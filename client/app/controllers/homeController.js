angular.module('eaApp.Home', [])
.controller('HomeController', function($scope, Factory) {
  $scope.title = 'Welcome to EA Home Page';
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
  });
  $scope.sendRecord = function() {
    Factory.addRecord($scope.matchInfo).then(function(res) {
      console.log(res);
    });
  };
});