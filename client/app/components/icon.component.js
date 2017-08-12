angular.module('appSvgIconSets', ['ngMaterial'])
  .config(function($mdIconProvider) {
    $mdIconProvider
       .iconSet('comment', 'images/icons/comment.svg', 24)
       .defaultIconSet('images/icons/comment.svg', 24);
  }).controller('iconController', function($scope) {});