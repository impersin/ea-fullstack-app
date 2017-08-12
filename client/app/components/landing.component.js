appModule.component('landingComponent', {
  templateUrl: 'templates/landing.html',
  controllerAs: 'landingController',
  controller: function($scope, $http) {
    $scope.videoUrl = 'https://www.youtube.com/watch?v=QV7PK8AVEKA?';
    $scope.mobileVideoUrl = 'https://www.youtube.com/watch?v=QV7PK8AVEKA?';
    $scope.title = 'https://www.youtube.com/watch?v=QV7PK8AVEKA?autoplay=1';
    
    $scope.sendRequest = function() {
      $http.get('/secure-api/checkRequest').then(function(res) {
        console.log(res);
      });
    };
  }
});