appModule.component('footerComponent', {
  templateUrl: 'app/templates/footer.html',
  controllerAs: 'footerController',
  controller: function($scope, $http) {
    $scope.title = 'This is footer component!! yay';
    
  }
});