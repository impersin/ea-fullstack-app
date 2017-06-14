angular.module('eaApp.Home', [])
.controller('HomeController', function($scope, Factory) {
  $scope.title = 'Welcom to EA Home Page';

  Factory.getAll().then(function(res) {
    $scope.matchResults = res.data;
  });
});