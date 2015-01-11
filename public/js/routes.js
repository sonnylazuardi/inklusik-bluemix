angular.module('inklusik.routes', ['simpleLogin'])

  .constant('ROUTES', {
    'login': {
      url: "/login",
      controller: 'LoginCtrl',
      animation: 'slide-in-up'
    },
    'play': {
      url: "/play/:name",
      templateUrl: "templates/play.html",
      controller: 'PlayCtrl',
      authRequired: true // must authenticate before viewing this page
    },
    'play/guest': {
      url: "/guestplay/:name",
      templateUrl: "templates/play.html",
      controller: 'PlayGuestCtrl',
    },
    'browse':{
      url: "/browse",
      templateUrl: "templates/browse.html",
      controller: 'BrowseCtrl'
    },
    'detail':{
      url: "/detail/:name",
      templateUrl: "templates/detail.html",
      controller: 'DetailCtrl'
    },
    'about':{
      url: "/about",
      templateUrl: "templates/about.html",
      controller: 'AboutCtrl'
    },
    'help':{
      url: "/help",
      templateUrl: "templates/help.html",
      controller: 'AboutCtrl'
    },
    'search':{
      url: "/search",
      templateUrl: "templates/search.html",
      controller: 'SearchCtrl'
    },
    'song':{
      url: "/song",
      templateUrl: "templates/song.html",
      controller: 'SongCtrl'
    },
    'lyric':{
      url: "/lyric/:id",
      templateUrl: "templates/lyric.html",
      controller: 'LyricCtrl'
    },
    'choose':{
      url: "/choose/:id",
      templateUrl: "templates/choose.html",
      controller: 'ChooseCtrl'
    },
    'stream':{
      url: "/stream/:id",
      templateUrl: "templates/stream.html",
      controller: 'StreamCtrl'
    },
    'streamlist':{
      url: "/streamlist",
      templateUrl: "templates/streamlist.html",
      controller: 'StreamListCtrl'
    }
  })
  
  .config(function($stateProvider) {
   
    $stateProvider.stateAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['requireUser', function(requireUser) {
        return requireUser();
      }];
      $stateProvider.state(path, route);
    }
  })

  .config(function($stateProvider, ROUTES, $urlRouterProvider) {
    angular.forEach(ROUTES, function(route, path) {
      if ( route.authRequired ) {
        $stateProvider.stateAuthenticated(path, route);
      } else {
        $stateProvider.state(path, route);
      }
    });
    // routes which are not in our map are redirected to /home
    $urlRouterProvider.otherwise('/browse');
  })

  .run(function($rootScope, $location, simpleLogin, ROUTES, loginRedirectPath) {
    simpleLogin.watch(check, $rootScope);

    $rootScope.$on("$routeChangeError", function(e, next, prev, err) {
      if( angular.isObject(err) && err.authRequired ) {
        $location.path(loginRedirectPath);
      }
    });

    function check(user) {
      if( !user && authRequired($location.path()) ) {
        $location.path(loginRedirectPath);
      }
    }

    function authRequired(path) {
      return ROUTES.hasOwnProperty(path) && ROUTES[path].authRequired;
    }
  });