var appModule = angular.module('myApp', [
  'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'appFactory',
  'ngCookies',
  'anguvideo',
  'ngMessages',
  'ngMaterial',
  'ngMdIcons'
]);

appModule.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/');
  
  var landingState = {
    name: 'landing',
    url: '/',
    template: '<landing-component></landing-component>',
  };

  var homeState = {
    name: 'home',
    url: '/home',
    template: '<home-component></home-component>'
  };

  var aboutState = {
    name: 'about',
    url: '/about',
    template: '<about-component></about-component>'
  };

  var profile = {
    name: 'profile',
    url: '/profile',
    template: '<profile-component></profile-component>'
  };

  var news = {
    name: 'news',
    url: '/news',
    template: '<h1>news page</h1>'
  };

  var matchResults = {
    name: 'matchResults',
    url: '/matchResults',
    template: '<result-component></result-component>'
  };

  // var post = {
  //   name: 'post',
  //   url: '/post',
  //   template: '<post-component></post-component>'
  // };

  $stateProvider.state(homeState);
  $stateProvider.state(aboutState);
  $stateProvider.state(landingState);
  $stateProvider.state(profile);
  $stateProvider.state(news);
  $stateProvider.state(matchResults);
  // $stateProvider.state(post);

  $httpProvider.interceptors.push(function($q, $cookies) {
    return {
      'request': function(config) {
        config.headers['token'] = $cookies.get('token');
        return config;
      }
    };
  });
}).run(function($rootScope, $cookies, $location) {
  $rootScope.$on('$locationChangeStart', function() {
    //we are looking for a token
    var token = $cookies.get('token');
    //if we found token
    if (token) {
      $rootScope.auth = true; 
      // //find out if token is expired
      // if (!jwtHelper.isTokenExpired(token)) {
      //   //if token is expired
      //   if (!auth.isAuthenticated) {
      //     //But token hasn't expired so authenticate user again 
      //     auth.authenticate(store.get('profile'), token);
      //   }
      // }
    } else { //if there is no token
      $rootScope.auth = false;
      // $location.path('/');
    }
  });
});