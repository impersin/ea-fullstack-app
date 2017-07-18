angular.module('fileUpload', [])
.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl, Factory) {
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(function(res) {
      console.log(res);
    });
  };
}]
);
