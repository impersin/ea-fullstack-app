appModule.component('profileComponent', {
  templateUrl: 'templates/profile.html',
  controllerAs: 'profileController',
  controller: function($scope, $cookies, Factory, $mdDialog, $timeout) {
    $scope.user = $cookies.get('userid');
    $scope.auth = $cookies.get('auth');
    $scope.title = 'about page';
    $scope.fieldset = false;
    $scope.title = 'FIFA 2018 Match Result Page';
    $scope.fieldset = false;
    $scope.win = $cookies.get('win');
    $scope.lose = $cookies.get('lose');
    $scope.profileImageUrl = 'https://s3-us-west-1.amazonaws.com/fifatalk/' + $cookies.get('profileImage');
  
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
  
      if (file === undefined) {
        $scope.authWarning('nofile');
      } else {
        var extention = file.name.split('.')[1].toLowerCase();
        if (extention === 'png' || extention === 'jpg' || extention === 'jpeg') {
          var fd = new FormData();
          fd.append('file', file);
          Factory.uploadFile(fd).then(function(res) {
            Factory.addProfileImage({userid: $scope.user, fileName: file.name}).then(function(res) {
              $timeout(function() {
                $cookies.put('profileImage', res.data);
                $scope.profileImageUrl = 'https://s3-us-west-1.amazonaws.com/fifatalk/' + res.data;
              }, 0);
              $scope.profileForm = false;
            });
          });
        } else {
          $scope.authWarning('fileType');
        }

      }
    };

    $scope.authWarning = function(type) {
      if (type === 'nofile') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Please Select File')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          .openFrom('#left')
          .closeTo(angular.element(document.querySelector('#right')))
        );  
      } else if (type === 'fileType') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Only PNG, JPG, JPEG are avaiable')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          .openFrom('#left')
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else if (type === 'session') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Session has expired Please login again')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          .openFrom('#left')
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Please Sign In ')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      }
    };

  }
});
