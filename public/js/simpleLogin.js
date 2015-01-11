
angular.module('simpleLogin', ['firebase', 'firebase.utils'])

  // a simple wrapper on simpleLogin.getUser() that rejects the promise
  // if the user does not exists (i.e. makes user required)
  .factory('requireUser', ['simpleLogin', '$q', function(simpleLogin, $q) {
    return function() {
      return simpleLogin.getUser().then(function (user) {
        return user ? user : $q.reject({ authRequired: true });
      });
    }
  }])

  .factory('simpleLogin', function($firebaseSimpleLogin, fbutil, createProfile, $q, $rootScope) {
      var auth = $firebaseSimpleLogin(fbutil.ref());
      var listeners = [];

      function statusChange() {
        console.log('status change');
        fns.getUser().then(function(user) {
          fns.user = user || null;
          angular.forEach(listeners, function(fn) {
            fn(user||null);
          });
        });
      }

      var fns = {
        user: null,

        getUser: function() {
          return auth.$getCurrentUser();
        },

        /**
         * @param {string} email
         * @param {string} pass
         * @returns {*}
         */
        login: function() {
          return auth.$login('facebook', {
            rememberMe: true
          });
        },

        logout: function() {
          console.log('logout');
          console.log(auth);
          auth.$logout();
        },

        removeUser: function(email, pass) {
          return auth.$removeUser(email, pass);
        },

        watch: function(cb, $scope) {
          fns.getUser().then(function(user) {
            cb(user);
          });
          listeners.push(cb);
          var unbind = function() {
            var i = listeners.indexOf(cb);
            if( i > -1 ) { listeners.splice(i, 1); }
          };
          if( $scope ) {
            $scope.$on('$destroy', unbind);
          }
          return unbind;
        }
      };

      $rootScope.$on('$firebaseSimpleLogin:login', statusChange);
      $rootScope.$on('$firebaseSimpleLogin:logout', statusChange);
      $rootScope.$on('$firebaseSimpleLogin:error', statusChange);
      statusChange();

      return fns;
  })

  .factory('createProfile', function(fbutil, $q, $timeout) {
    return function(id, name, avatar) {
      var def = $q.defer();
      var user = fbutil.syncObject(['users', id]);
      user.$loaded().then(function() {
        console.log(user);
        user.name = name;
        user.avatar = avatar;
        user.uid = id;
        user.$save();
        def.resolve(user);
      });
      return def.promise;
    }
  });