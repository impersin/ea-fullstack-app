var app = angular.module('eaApp', [
  'ngRoute',
  'eaApp.Home',
  'eaApp.Service',
  'ngFlag'
]);

app.config(($routeProvider) => {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/home.html',
    controller: 'HomeController'
  })
  .otherwise({redirectTo: '/'});
});