appModule.component('footerComponent', {
  templateUrl: 'templates/footer.html',
  controllerAs: 'footerController',
  controller: function($scope, $http, $location) {
    $scope.title = 'This is footer component!! yay';
    $scope.toggle = function() {
      return $location.path() !== '/';
    }; 
    
  }
});