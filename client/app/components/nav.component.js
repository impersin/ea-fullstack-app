appModule.component('navComponent', {
  templateUrl: 'app/templates/navBar.html',
  controllerAs: 'navController',
  controller: function($scope, $route, $window, $rootScope, Factory, $location, $mdDialog, $cookies) {

    $scope.title = 'FIFA 2018';
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.userId = '';
    $scope.password = '';
    $scope.confirm = '';
    $scope.email = '';
    $scope.isCollapsed = true;
    $scope.auth = $rootScope.auth;
    $scope.regex = '.{6,}';
    $scope.required = true;

    $scope.addUser = function() {
      Factory.signUp({firstName: $scope.firstName, lastName: $scope.lastName, userid: $scope.userId, password: $scope.password, email: $scope.email}).then(function(res) {
        if (res.status !== 409) {
          $scope.auth = $cookies.get('auth');
          $location.path('/home');
          $scope.firstName = '';
          $scope.lastName = '';
          $scope.userId = '';
          $scope.password = '';
          $scope.confirm = '';
          $scope.email = '';
        } else {
          $scope.userId = '';
          $scope.password = '';
          $scope.confirm = '';
          $scope.authWarning('duplicatedID');
        }
      });
    };
    $('.dropdown-menu input').click(function(e) {
      e.stopPropagation();
    });

    $scope.login = function() {
      Factory.login({userid: $scope.userId, password: $scope.password}).then(function(res) {
        if (res.status !== 404) {
          $scope.userId = '';
          $scope.password = '';
          if ($location.path() === '/home') {
            $window.location.reload();
            $scope.$apply(function () {
              $scope.auth = $cookies.get('auth');
            });
          } else {
            $scope.auth = $cookies.get('auth');
            $location.path('/home');  
          }
        } else {
          $scope.userId = '';
          $scope.password = '';
          $scope.authWarning();
        }
      });
    };

    $scope.authWarning = function(type) {
      if (type === 'duplicatedID') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('ID is already exists')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );  
      } else {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Please check ID or Password')
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

    $scope.logOut = function() {
      Factory.signOut().then(function(res) {
        $scope.auth = $rootScope.auth;
        $location.path('/');
      });
    };
  }
});




