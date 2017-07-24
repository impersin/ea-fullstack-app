appModule.component('navComponent', {
  templateUrl: 'app/templates/navBar.html',
  controllerAs: 'navController',
  controller: function($scope, $route, $window, $rootScope, Factory, $location, $cookies) {

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
        $scope.auth = $cookies.get('auth');
        $location.path('/home');
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.userId = '';
        $scope.password = '';
        $scope.email = '';
      });
    };
    $('.dropdown-menu input').click(function(e) {
      e.stopPropagation();
    });

    $scope.login = function() {
      Factory.login({userid: $scope.userId, password: $scope.password}).then(function(res) {
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
      });
    };

    $scope.logOut = function() {
      Factory.signOut().then(function(res) {
        $scope.auth = $rootScope.auth;
        $location.path('/');
      });
    };
  }
});




