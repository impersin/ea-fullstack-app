appModule.component('sidebarComponent', {
  templateUrl: 'app/templates/sidebar.html',
  controllerAs: 'sidebarController',
  controller: function($scope, $rootScope, $cookies, $http, $mdDialog, Factory, $window, socket, $anchorScroll, $location) {

    $scope.header = 'This is sidebar component!! yay';
    $scope.auth = $cookies.get('auth');
    $scope.toggle = false;
    $scope.messages = []; 

    $scope.message = {
      userid: $cookies.get('userid'),
      text: ''
    };
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
      if (file) {
        $scope.newPost.fileName = file.name;
        var fd = new FormData();
        fd.append('file', file);
        Factory.uploadFile(fd).then(function(res) {
          Factory.addPost($scope.newPost).then(function(res) {
            $window.location.reload();
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
    $scope.message = {
      userid: $cookies.get('userid'),
      text: ''
    };
    
    socket.on('connection', function(data) {
      $scope.$apply(function () {
        $scope.messages = data;
      });
    });

    $scope.sendMessage = function(keyEvent) {
      if (keyEvent.which === 13) {
        socket.emit('msg', $scope.message);
        $scope.message.text = '';
      }
    };

    socket.on('newmsg', function(data) {
      $scope.$apply(function () {
        $scope.messages = data;
      });
    });

  }
});