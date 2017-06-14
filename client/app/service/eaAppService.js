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
      }
    };
  });