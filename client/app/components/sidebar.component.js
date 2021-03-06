appModule.component('sidebarComponent', {
  templateUrl: 'templates/sidebar.html',
  controllerAs: 'sidebarController',
  controller: function($scope, $rootScope, $cookies, $http, $mdDialog, Factory, $window, socket, $anchorScroll, $location, $timeout) {

    $scope.header = 'This is sidebar component!! yay';
    $scope.auth = $cookies.get('auth');
    $scope.currentUser = $cookies.get('userid');
    $scope.toggle = false;
    $scope.postButtonName = 'New Post'; 
    $scope.message = {
      text: ''
    };
    $scope.newPost = {
      userid: $cookies.get('userid'),
      title: '',
      text: '',
      fileName: ''
    };

    $http({
      method: 'GET',
      url: 'api/chat/messages'
    }).then(function mySuccess(res) {
      $scope.messages = res.data;
    }, function myError(res) {
      console.log(res);
    });
    
    $scope.toggleForm = function() {
      if (!$cookies.get('auth')) {
        $scope.authWarning();
      } else if ($cookies.get('auth')) {
        if ($scope.postButtonName === 'CANCLE') {
          $scope.postButtonName = 'NEW POST';
        } else {
          $scope.postButtonName = 'CANCLE';
        }
        $scope.toggle = !$scope.toggle;
      }
    };

    $scope.addPost = function() {
      var file = $scope.file;
      $scope.newPost.avatar = $cookies.get('profileImage');
      if (file) {
        $scope.newPost.fileName = file.name;
        var fd = new FormData();
        fd.append('file', file);
        Factory.uploadFile(fd).then(function(res) {
          Factory.addPost($scope.newPost).then(function(res) {
            if (res.status !== 500) {
              $window.location.reload();
            } else {
              $scope.authWarning('session');
              $scope.logOut();
            }
          });
        });
      } else {
        Factory.addPost($scope.newPost).then(function(res) {
          if (res.status !== 500) {
            if ($location.path() !== '/home') {
              $location.path('/home');
            } else {
              $window.location.reload();
            }
          } else {
            $scope.authWarning('session');
            $scope.logOut();
          }
        });

      }
    };
    
    $scope.authWarning = function(type) {
      if (type === 'session') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('session has expired Please login again')
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
      if (!$cookies.get('auth')) {
        $scope.authWarning();  
      } else {
        if (keyEvent.which === 13) {
          $scope.message.userid = $cookies.get('userid'),
          $scope.message.avatar = $cookies.get('profileImage');
          socket.emit('newMessage', $scope.message);
          $scope.message.text = '';
        }
        
      }
    };

    socket.on('newmsg', function(data) {
      $scope.$apply(function () {
        $scope.messages = data;
      });
    });

    $scope.logOut = function() {
      $timeout(function() {
        var el = document.getElementById('logout');
        angular.element(el).triggerHandler('click');
      }, 1000);
    };

    $scope.changeBackground = function(type) {
      var myEl = angular.element(document.querySelector('.chat-screen'));
      if (type === 'over') {
        myEl.css('background-color', 'floralwhite');
      } else {
        myEl.css('background-color', 'white');
      }
    };
  }
});