appModule.component('aboutComponent', {
  templateUrl: 'app/templates/about.html',
  controllerAs: 'aboutController',
  controller: function($scope) {
    $scope.title = 'about page';
  }
});
