appModule.component('profileComponent', {
  templateUrl: 'app/templates/profile.html',
  controllerAs: 'profileController',
  controller: function($scope, $cookies, Factory) {
    $scope.title = 'about page';
    $scope.fieldset = false;
    $scope.title = 'FIFA 2018 Match Result Page';
    $scope.fieldset = false;
    $scope.win = $cookies.get('win');
    $scope.lose = $cookies.get('lose');
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

    $scope.toggleFieldset = function() {
      $scope.fieldset = !$scope.fieldset;
    };

    Factory.getAll().then(function(res) {
    
      $scope.userName = $cookies.get('userName');
      $scope.matchResults = res.data.filter(function(match) {
        if (match['Player Name'].toUpperCase() === $scope.userName.toUpperCase()) {
          return match;
        } 
      });
    });
  }
});
