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
        $scope.auth = $cookies.get('auth');
        $scope.userId = '';
        $scope.password = '';
        if ($location.path() === '/home') {
        } else {
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

// var compareTo = function() {
//   return {
//     require: 'ngModel',
//     scope: {
//       otherModelValue: '=compareTo'
//     },
//     link: function(scope, element, attributes, ngModel) {

//       ngModel.$validators.compareTo = function(modelValue) {
//         return modelValue === scope.otherModelValue;
//       };

//       scope.$watch('otherModelValue', function() {
//         ngModel.$validate();
//       });
//     }
//   };
// };


