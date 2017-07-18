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
    $scope.commenterList = [];
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
        $scope.posts = res.data;
        $scope.commenterList = res.data;
      });
    };
    $scope.getAllPosts();

    $scope.sendComment = function() {
      Factory.sendComment($scope.newComment.postIndex, $scope.newComment).then(function(res) {
        var id = res.data.postIndex;
        $scope.commentToggles['comment' + id] = true; 
        $scope.newComment.comment = '';
        $scope.getAllPosts();
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
        $scope.authWarning('auth');
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
    
    $scope.authWarning = function(type) {
      if (type === 'auth') {
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
      } else if (type === 'vote') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('You cannot vote on own post')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      } else if (type === 'duplicate') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Cannot vote more than one time')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(document.querySelector('#right')))
        );
      }
    };

    $scope.sendRequest = function() {
      $http.get('/secure-api/checkRequest').then(function(res) {
        console.log(res);
      });
    };

    $scope.vote = function(event) {
      var postIndex = this.post.postIndex;
      var type = event.target.id.slice(0, event.target.id.length - 1);

      if (!$cookies.get('auth')) {
        $scope.authWarning('auth');
      } else {
        var currentUser = $cookies.get('userid'); 
        var postedUser = this.post.userid;
        
        if ($scope.checkCommenterList(postIndex, currentUser)) {
          $scope.authWarning('duplicate');
        } else {
          if (currentUser === postedUser) {
            $scope.authWarning('vote');
          } else {
            Factory.addVoteCount(postIndex, currentUser, type).then(function(res) {
              var satisfiedElement = angular.element( document.querySelector('#satisfiedCount' + postIndex) );
              var neutralElement = angular.element( document.querySelector('#neutralCount' + postIndex) );
              var dissatisfiedElement = angular.element( document.querySelector('#dissatisfiedCount' + postIndex) );
              satisfiedElement[0].innerText = res.data.satisfied;
              neutralElement[0].innerText = res.data.neutral;
              dissatisfiedElement[0].innerText = res.data.dissatisfied;
              $scope.getAllPosts();
            });  
          }
        }
        
      }
    };
    $scope.checkCommenterList = function(num, user) {
      var result = false;
      for (var i = 0; i < $scope.commenterList.length; i++) {
        var postNum = $scope.commenterList[i].postIndex;
        var commenterList = $scope.commenterList[i].commenterList;
        if (postNum === num && commenterList.indexOf(user) > -1) {
          console.log('here');
          result = true;
          break;
        }
      }
      return result;   
    };  
  }
});