appModule.component('aboutComponent', {
  templateUrl: 'templates/about.html',
  controllerAs: 'aboutController',
  controller: function($scope) {
    $scope.title = 'about page';
  }
});
