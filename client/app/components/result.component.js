appModule.component('resultComponent', {
  templateUrl: 'templates/result.html',
  controllerAs: 'matchResultController',
  controller: function($scope, Factory) {
    $scope.title = 'This is main contents';
    $scope.fieldset = false;
    $scope.toggleFieldset = function() {
      $scope.fieldset = !$scope.fieldset;
    };

    $scope.title = 'FIFA 2018 Match Result Page';
    $scope.fieldset = false;
    $scope.matchInfo = {
      playerName: '',
      location: '',
      duration: 0,
      playerTeam: '',
      opponent: '',
      result: '',
      score: ''
    };

    $scope.isoCode = {
      korea: 'kr',
      usa: 'us',
      spain: 'es',
      china: 'cn',
      taiwan: 'tw',
      england: 'gb',
      japan: 'jp',
      portugal: 'pt',
      germany: 'de',
      france: 'fr',
      argentina: 'ar',
      brazil: 'br'
    };

    $scope.toggleFieldset = function() {
      $scope.fieldset = !$scope.fieldset;
    };

    Factory.getAll().then(function(res) {
      $scope.matchResults = res.data;
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

  }
});