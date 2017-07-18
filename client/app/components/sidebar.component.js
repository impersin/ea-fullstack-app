appModule.component('sidebarComponent', {
  templateUrl: 'app/templates/sidebar.html',
  controllerAs: 'sidebarController',
  controller: function($scope, $rootScope, $cookies, $http, $mdDialog, Factory, $window) {

    $scope.header = 'This is sidebar component!! yay';
    $scope.auth = $cookies.get('auth');
    $scope.toggle = false; 
    $scope.newPost = {
      userid: $cookies.get('userid'),
      title: '',
      text: '',
      fileName: ''
    };
    
    $scope.toggleForm = function() {
      if (!$cookies.get('auth')) {
        $scope.openFromLeft();
      } else if ($cookies.get('auth')) {
        $scope.toggle = !$scope.toggle;
      }
    };

    $scope.addPost = function() {
      var file = $scope.file;
      $scope.newPost.fileName = file.name;
      if (file) {
        var fd = new FormData();
        fd.append('file', file);
        Factory.uploadFile(fd).then(function(res) {
          Factory.addPost($scope.newPost).then(function(res) {
            console.log(res);
          });
        });
      } else {
        Factory.addPost($scope.newPost).then(function(res) {
          $window.location.reload();
        });

      }
    };
    
    $scope.openFromLeft = function() {
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
    };

  }
});