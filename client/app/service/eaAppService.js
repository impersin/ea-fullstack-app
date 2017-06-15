angular.module('eaApp.Service', [])
  .factory('Factory', function($http) {
    return {
      getAll: function() {
        return $http({
          method: 'GET',
          url: 'api/record'
        }).then(function(res) {
          return res;
        });
      },
      addRecord: function(matchResult) {
        return $http({
          method: 'POST',
          url: 'api/record',
          data: matchResult
        }).then(function(res) {
          console.log(res);
        });
      }
    };
  });