angular.module('appFactory', [])
  .factory('Factory', function($http, $cookies, $rootScope) {
    return {
      getAll: function() {
        return $http({
          method: 'GET',
          url: 'api/record'
        }).then(function(res) {
          var win = 0;
          var lose = 0;
          res.data.forEach(function(match) {
            var score1 = parseInt(match['Final Score'][0]);
            var score2 = parseInt(match['Final Score'][2]);
            if (score1 > score2) {
              match['Final Score'] += ' WON';
              if (match['Player Name'].toUpperCase() === $cookies.get('userName').toUpperCase()) {
                win++;
              }    
            } else {
              match['Final Score'] += ' LOST';
              if (match['Player Name'].toUpperCase() === $cookies.get('userName').toUpperCase()) {
                lose++;
              }
            }
          }, this);
          $cookies.put('win', win);
          $cookies.put('lose', lose);
          return res;
        });
      },
      signUp: function(newUser) {
        return $http({
          method: 'POST',
          url: 'api/signUp',
          data: newUser
        }).then(function(res) {
          console.log(res);
          $cookies.put('userid', res.data.userid);
          $cookies.put('token', res.data.token);
          $cookies.put('auth', res.data.success);
          $cookies.put('userName', res.data.firstName + res.data.lastName);
          $cookies.put('email', res.data.email);
          return res;
        });
      },
      login: function(newUser) {
        return $http({
          method: 'POST',
          url: 'api/login',
          data: newUser
        }).then(function(res) {
          $cookies.put('userid', res.data.userid);
          $cookies.put('token', res.data.token);
          $cookies.put('auth', res.data.success);
          $cookies.put('userName', res.data.firstName + ' ' + res.data.lastName);
          $cookies.put('email', res.data.email);
          console.log(res.data.token);
        
          return res;
        });
      },
      getAllPosts: function() {
        return $http({
          method: 'GET',
          url: 'api/post'
        }).then(function(res) {
          return res;
        });
      },
      addPost: function(newPost) {
        return $http({
          method: 'POST',
          url: 'secure-api/post/add',
          data: newPost
        }).then(function(res) {
          return res;
        });
      },
      deletePost: function(postIndex) {
        return $http({
          method: 'DELETE',
          url: `secure-api/post/delete/${postIndex}`,
        }).then(function(res) {
          
        });
      },
      uploadFile: function(file) {
        return $http({
          method: 'POST',
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          url: 'secure-api/post/upload/file',
          data: file
        }).then(function(res) {
          return res;
        });
      },
      sendComment: function(postIndex, newComment) {
        return $http({
          method: 'PUT',
          url: `secure-api/update/add/comment/${postIndex}`,
          data: newComment
        }).then(function(res) {
          return res;
        });
      },
      addRecord: function(matchResult) {
        return $http({
          method: 'POST',
          url: 'record',
          data: matchResult
        }).then(function(res) {
          console.log(res);
        });
      },

      signOut: function() {
        return $http({
          method: 'GET',
          url: 'api/signOut',
        }).then(function(res) {
          // console.log(res);
          $cookies.remove('token');
          $cookies.remove('auth');
          $cookies.remove('userName');
          $cookies.remove('email');
          $cookies.remove('win');
          $cookies.remove('lose');
          $cookies.remove('userid');
          $rootScope.auth = false;
          return res;
        });
      },

      addViewCount: function(postIndex, newComment) {
        return $http({
          method: 'PUT',
          url: `secure-api/update/add/viewcount/${postIndex}`,
        }).then(function(res) {
          return res;
        });
      },

      addVoteCount: function(postIndex, commenter, type) {
        return $http({
          method: 'PUT',
          url: `secure-api/update/add/vote/${postIndex + '+' + commenter + '+' + type}`
        }).then(function(res) {
          return res;
        });
      }

    };
  });

  