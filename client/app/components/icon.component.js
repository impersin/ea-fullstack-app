angular.module('appSvgIconSets', ['ngMaterial'])
  .config(function($mdIconProvider) {
    $mdIconProvider
       .iconSet('comment', 'app/images/icons/comment.svg', 24)
       .defaultIconSet('app/images/icons/comment.svg', 24);
  }).controller('iconController', function($scope) {});