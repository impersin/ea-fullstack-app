appModule.component('postComponent', {
  templateUrl: 'app/templates/post.html',
  controllerAs: 'postController',
  controller: function($scope, Factory, $http) {
    $scope.title = 'This is my first Angular 1.5 component!! yay';
    $scope.posts = true;

    $scope.toggle = function() {
      $scope.posts = !$scope.posts;
    };
    
    
    // $scope.getAllPosts = function() {
    //   Factory.getAllPosts().then(function(res) {
    //     // console.log(res.data);
    //     $scope.posts = res.data;
    //   });
    // };
    $scope.sendRequest = function() {
      $http.get('/secure-api/checkRequest').then(function(res) {
        console.log(res);
      });
    };

  }
});