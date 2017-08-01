appModule.component('homeComponent', {
  templateUrl: 'app/templates/home.html',
  controllerAs: 'headerController',
  controller: function($scope, $rootScope, $cookies, $http, $mdDialog, Factory, $window, $location, $anchorScroll, $timeout) {
    $scope.title = 'This is my first Angular 1.5 component!! yay';
    $scope.auth = $cookies.get('auth');
    $scope.currentUser = $cookies.get('userid');
    $scope.comment = true;
    $scope.commentForm = false;
    $scope.postToggles = {};
    $scope.commentToggles = {};
    $scope.formToggles = {};
    $scope.commenterList = [];
    $scope.limit = 15;
    $scope.boardLimit = 4;
    $scope.newComment = {
      commentedBy: '',
      postIndex: '',
      title: '',
      comment: '',
    };
    $scope.posts = [];
    $scope.switch = false;
    $scope.boardData = [];
    $scope.commentSortedByNewest = true;

    $scope.test = function() {
      $scope.switch = !$scope.switch;
    };
  
    $scope.logOut = function() {
      $timeout(function() {
        var el = document.getElementById('logout');
        angular.element(el).triggerHandler('click');
      }, 1000);
    };

    $scope.loadPost = function() {
      $location.path('/post');
    };

    $scope.getAllPosts = function() {
      Factory.getAllPosts().then(function(res) {
        $scope.posts = res.data;
        $scope.commenterList = res.data;
        $scope.boardData = [];
        res.data.forEach(function(post) {
          $scope.boardData.push(post);
        });
        $scope.boardSort($scope.boardData, 'views');
      });
    };
    $scope.getAllPosts();

    $scope.sendComment = function() {
      //$scope.newComment set by toggle form
      Factory.sendComment($scope.newComment.postIndex, $scope.newComment).then(function(res) {
        if (res.status !== 500) {
          var id = $scope.newComment.postIndex;
          $scope.postToggles['post' + id] = true; 
          $scope.newComment.comment = '';
          $scope.getAllPosts();
          if (!$scope.commentToggles['comment' + id]) {
            $scope.toggleComment(id);
          }
        } else {
          $scope.authWarning('session');
          $scope.logOut();
        }
      });
    };

    $scope.toggle = function($event) {
      var postIndex = this.post.postIndex;
      var id = 'post' + this.post.postIndex;
      var myEl = angular.element( document.querySelector('#' + id) );
      var poster = $event.target.classList[1];
      if (!$scope.postToggles[id]) {
        if ($scope.currentUser === poster) {
          $scope.postToggles[id] = true;
        } else {
          Factory.addViewCount(this.post.postIndex).then(function(res) {
            var el = angular.element( document.querySelector('#viewcount' + postIndex) );
            el[0].innerText = 'viewed: ' + res.data.viewcount;
            $scope.postToggles[id] = true;
          }); 
        }
      } else {
        // myEl.addClass('hide');
        $scope.postToggles[id] = false; 
      }
    };

    $scope.toggleComment = function(postNum) {
      if (!postNum) {
        var id = 'comment' + this.post.postIndex;
        var myEl = angular.element( document.querySelector('#' + id) );  
      } else {
        var id = 'comment' + postNum;
        var myEl = angular.element( document.querySelector('#' + id) ); 
      }
      if (!$scope.commentToggles[id]) {
        // myEl.removeClass('hide');
        $scope.commentToggles[id] = true;
      } else {
        // myEl.addClass('hide');
        $scope.commentToggles[id] = false; 
      }
    };

    $scope.setCommentIndex = function() {
      //being invoked when user click textarea
      var myEl = document.getElementById('comment' + this.post.postIndex); 
      $scope.newComment.commentIndex = myEl.childNodes[1].children.length + 1; 
    };

    $scope.toggleForm = function() {
      $scope.newComment.commentedBy = $cookies.get('userid');
      //Set comment postIndex when user click textarea form
      $scope.newComment.postIndex = this.post.postIndex;
      $scope.newComment.title = this.post.title;
      if (!$cookies.get('auth')) {
        $scope.authWarning('auth');
      } else if ($cookies.get('auth')) {
        var id = 'form' + this.post.postIndex;
        var myEl = angular.element( document.querySelector('#' + id) );
        if (!$scope.formToggles[id]) {
          // myEl.removeClass('hide');
          $scope.formToggles[id] = true; 
        } else {
          // myEl.addClass('hide');
          $scope.formToggles[id] = false; 
        }
      }
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
      } else if ('session') {
        $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('session has expired Please login again')
          .textContent('')
          .ariaLabel('Left to right demo')
          .ok('Close')
          .openFrom('#left')
          .closeTo(angular.element(document.querySelector('#right')))
        );
      }
    };

    $scope.vote = function(event) {
      var postIndex = this.post.postIndex;
      var type = event.target.id.replace(/[0-9]/g, '');
      if (!$cookies.get('auth')) {
        $scope.authWarning('auth');
      } else {
        var postedUser = this.post.userid;        
        if ($scope.checkCommenterList($scope.commenterList, postIndex, $scope.currentUser)) {
          $scope.authWarning('duplicate');
        } else {
          if ($scope.currentUser === postedUser) {
            $scope.authWarning('vote');
          } else {
            Factory.addVoteCount(postIndex, $scope.currentUser, type).then(function(res) {
              if (res.status !== 500) {
                var satisfiedElement = angular.element( document.querySelector('#satisfiedCount' + postIndex) );
                var neutralElement = angular.element( document.querySelector('#neutralCount' + postIndex) );
                var dissatisfiedElement = angular.element( document.querySelector('#dissatisfiedCount' + postIndex) );
                satisfiedElement[0].innerText = res.data.satisfied;
                neutralElement[0].innerText = res.data.neutral;
                dissatisfiedElement[0].innerText = res.data.dissatisfied;
                $scope.getAllPosts();
              } else {
                $scope.authWarning('session');
                $scope.logOut();
              }
            });  
          }
        } 
      }
    };

    $scope.commentVote = function(event, index) {
      var postIndex = this.comment.postIndex;
      var commentIndex = this.comment.commentIndex;
      var commentedBy = this.comment.commentedBy;
      // Get only type of vote
      var type = event.target.id.replace(/[0-9]/g, '');
      var voter = $scope.currentUser;
      var comments = $scope.searchPost(postIndex, 'commentVote');
      var voterList = comments[commentIndex - 1].voterList;
      if (!$cookies.get('auth')) {
        $scope.authWarning('auth');
      } else {
        if ($scope.currentUser === commentedBy) {
          $scope.authWarning('vote');
        } else {
          if (voterList.includes(voter)) {
            $scope.authWarning('duplicate');
          } else {
            Factory.addCommentVoteCount({
              postIndex: postIndex,
              commentIndex: commentIndex,
              voter: $scope.currentUser,
              type: type
            }).then(function(res) {
              $scope.getAllPosts();
              voterList.push(voter);
            });
          }
        }
      }
    };

    $scope.checkCommenterList = function(data, num, user) {
      var result = false;
      for (var i = 0; i < data.length; i++) {
        var postNum = data[i].postIndex;
        var commenterList = data[i].commenterList;
        if (postNum === num && commenterList.indexOf(user) > -1) {
          result = true;
          break;
        }
      }
      return result;   
    };

    $scope.sortCommentBy = function(type) {
      var length = this.post.comments.length;
      if (type === 'soccerball' && $scope.commentSortedByNewest === true) {
        $scope.commentSortedByNewest = false;
        this.post.comments.sort(function(a, b) {
          return a.soccerball - b.soccerball;
        });
        $scope.commentSortedByNewest = false;
      } else if (type === 'newest' && $scope.commentSortedByNewest === false ) {
        this.post.comments.sort(function(a, b) {
          return a.commentIndex - b.commentIndex;
        });
        $scope.commentSortedByNewest = true; 
      }
    };

    $scope.deletePost = function(event) {
      var postIndex = this.post.postIndex;
      Factory.deletePost(postIndex).then(function(res) {
        if (res.status !== 500) {
          $scope.getAllPosts();
        } else {
          $scope.authWarning('session');
          $scope.logOut();
        }
      });  
    };

    $scope.boardSort = function(data, sortBy) {
      if (arguments.length === 1) {
        sortBy = data;
        data = $scope.boardData;
        if (sortBy === 'views') {
          $scope.boardData = data.sort(function(a, b) {
            return b.viewcount - a.viewcount;
          }); 
        } else if (sortBy === 'popular') {
          $scope.boardData = data.sort(function(a, b) {
            return b.satisfied - a.satisfied;
          });
        } else {
          $scope.boardData = data.sort(function(a, b) {
            return b.comments.length - a.comments.length;
          });
        }
      } else {
        return data.sort(function(a, b) {
          return b.viewcount - a.viewcount;
        });
      }
    };

    $scope.searchPost = function(target, type) {
      var start = 0;
      var end = $scope.posts.length - 1;
      var mid;
      var post;
      while (start <= end) {
        mid = Math.floor((start + end) / 2);
        if ($scope.posts[mid].postIndex === target) {
          if (type === undefined) {
            $scope.searchInput = $scope.posts[mid].title;
            $scope.postToggles['post' + target] = true;
            return;
          } else if (type === 'commentVote') {
            return $scope.posts[mid].comments;
          }
        } else if ($scope.posts[mid].postIndex > target) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }
    };

    $scope.searchInputReset = function(target, postIndex) {
      $scope.searchInput = '';
      $scope.postToggles[target] = false;
      $scope.commentToggles['comment' + postIndex] = false;
    };

    $scope.addToLimit = function($event) {
      var el = angular.element( document.querySelector('.home-posts') );
      $scope.limit = $scope.limit + 15;
      $timeout( function() {
        el[0].scrollTop += 200;
      }, 500 );
    };
    
  }
});
