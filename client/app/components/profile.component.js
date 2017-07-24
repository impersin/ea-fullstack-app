appModule.component('profileComponent', {
  templateUrl: 'app/templates/profile.html',
  controllerAs: 'profileController',
  controller: function($scope, $cookies, Factory) {
    $scope.user = $cookies.get('userid');
    $scope.auth = $cookies.get('auth');
    $scope.title = 'about page';
    $scope.fieldset = false;
    $scope.title = 'FIFA 2018 Match Result Page';
    $scope.fieldset = false;
    $scope.win = $cookies.get('win');
    $scope.lose = $cookies.get('lose');
    $scope.profileForm = false;
    $scope.profileImage = 'https://s3-us-west-1.amazonaws.com/fifatalk/' + $cookies.get('profileImage');
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

    Factory.getAll().then(function(res) {    
      $scope.userName = $cookies.get('userName');
      $scope.matchResults = res.data.filter(function(match) {
        if (match['Player Name'].toUpperCase() === $scope.userName.toUpperCase()) {
          return match;
        } 
      });
    });

    $scope.formToggle = function() {
      $scope.profileForm = !$scope.profileForm;
    };

    $scope.sendProfileImage = function() {
      var file = $scope.file;
      var fd = new FormData();
      fd.append('file', file);
      Factory.uploadFile(fd).then(function(res) {
        Factory.addProfileImage({userid: $scope.user, fileName: file.name}).then(function(res) {
          $scope.profileImage = 'https://s3-us-west-1.amazonaws.com/fifatalk/' + res.data;
          $scope.profileForm = false;
        });
      });
    };

  }
});
