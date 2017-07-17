appModule.component('homeComponent', {
  templateUrl: 'app/templates/home.html',
  controllerAs: 'headerController',
  controller: function($scope, $rootScope, $cookies, $http, $mdDialog, Factory, $window, $location) {
    $scope.title = 'This is my first Angular 1.5 component!! yay';
    $scope.auth = $cookies.get('auth');
    $scope.comment = true;
    $scope.commentForm = false;
    $scope.postToggles = {};
    $scope.commentToggles = {};
    $scope.formToggles = {};
    $scope.newComment = {
      commentedBy: '',
      postIndex: '',
      title: '',
      comment: '',
    };

    $scope.switch = false;

    $scope.test = function() {
      $scope.switch = !$scope.switch;
    };

    $scope.loadPost = function() {
      $location.path('/post');
    };

    $scope.getAllPosts = function() {
      Factory.getAllPosts().then(function(res) {
        console.log(res.data);
        $scope.posts = res.data;
      });
    };
    $scope.getAllPosts();

    $scope.sendComment = function() {
      Factory.sendComment($scope.newComment.postIndex, $scope.newComment).then(function(res) {
        $window.location.reload();
      });
    };

    $scope.toggle = function() {
      var postIndex = this.post.postIndex;
      var id = 'post' + this.post.postIndex;
      var myEl = angular.element( document.querySelector('#' + id) );
      // console.log(myEl);
      if (!$scope.postToggles[id]) {
        myEl.removeClass('hide');
        Factory.addViewCount(this.post.postIndex).then(function(res) {
          var el = angular.element( document.querySelector('#viewcount' + postIndex) );
          el[0].innerText = 'viewed: ' + res.data.viewcount;
          $scope.postToggles[id] = true;
        }); 
      } else {
        myEl.addClass('hide');
        $scope.postToggles[id] = false; 
      }
    };

    $scope.toggleComment = function() {
      // console.log('===============>', this.post);
      var id = 'comment' + this.post.postIndex;
      var myEl = angular.element( document.querySelector('#' + id) );
      // console.log(myEl);
      if (!$scope.commentToggles[id]) {
        myEl.removeClass('hide');
        $scope.commentToggles[id] = true; 
      } else {
        myEl.addClass('hide');
        $scope.commentToggles[id] = false; 
      }
    };

    $scope.toggleForm = function() {
      $scope.newComment.commentedBy = $cookies.get('userid');
      $scope.newComment.postIndex = this.post.postIndex;
      $scope.newComment.title = this.post.title;
      // console.log($scope.newComment); 
      if (!$cookies.get('auth')) {
        $scope.openFromLeft();
      } else if ($cookies.get('auth')) {
        var id = 'form' + this.post.postIndex;
        var myEl = angular.element( document.querySelector('#' + id) );
        console.log(myEl);
        if (!$scope.formToggles[id]) {
          // myEl.removeClass('hide');
          $scope.formToggles[id] = true; 
        } else {
          // myEl.addClass('hide');
          $scope.formToggles[id] = false; 
        }
      }
      console.log($scope.formToggles);
    };
    
    $scope.openFromLeft = function() {
      $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Please Sign In ')
        .textContent('')
        .ariaLabel('Left to right demo')
        .ok('Close')
        // You can specify either sting with query selector
        .openFrom('#left')
        // or an element
        .closeTo(angular.element(document.querySelector('#right')))
      );
    };

    $scope.sendRequest = function() {
      $http.get('/secure-api/checkRequest').then(function(res) {
        console.log(res);
      });
    };

    $scope.vote = function(event) {
      var postIndex = this.post.postIndex;
      var type = event.target.id.slice(0, event.target.id.length - 1);
      Factory.addVoteCount(postIndex, type).then(function(res) {
        var satisfiedElement = angular.element( document.querySelector('#satisfiedCount' + postIndex) );
        var neutralElement = angular.element( document.querySelector('#neutralCount' + postIndex) );
        var dissatisfiedElement = angular.element( document.querySelector('#dissatisfiedCount' + postIndex) );
        satisfiedElement[0].innerText = res.data.satisfied;
        neutralElement[0].innerText = res.data.neutral;
        dissatisfiedElement[0].innerText = res.data.dissatisfied;
      });
    };

  }
});