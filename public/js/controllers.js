angular.module('inklusik.controllers', [])

.controller('PlayCtrl', function($scope, simpleLogin, Player, fbutil, $stateParams, Instruments, requireUser, Shake, Partiturs, $interval, $ionicScrollDelegate) {
  var name = $stateParams.name;
  $scope.name = name;
  $scope.instrument = Instruments.find(name);
  $scope.harmony = fbutil.syncArray(['harmony'], {limit: 10});
  $scope.last_melody = fbutil.syncArray(['harmony'], {limit: 1});

  $scope.selected = '';
  $scope.holded = false;
  var timer, timer2, timer3, delay = 350;

  requireUser().then(function(user) {
    $scope.user = user;
    var profile = fbutil.syncObject(['users', user.uid]);
    profile.$bindTo($scope, 'profile');

    //mencari user pertama
    $scope.presences = fbutil.syncArray(['presences']);

    profile.$loaded().then(function(snap) {
      var listRef = fbutil.ref('presences');
      var userObj = {
        uid: user.uid,
        name: snap.name,
        avatar: snap.avatar,
        instrument: {name: name, image: $scope.instrument.image}
      };
      $scope.profile = userObj;
      var userRef = fbutil.ref('presences', user.uid);
      userRef.set(userObj);

      var presenceRef = fbutil.ref('.info', 'connected');
      presenceRef.on('value', function(snap) {
        userRef.onDisconnect().remove();
      });

    });
  });

  var onlineusers = fbutil.syncObject('presences');
  onlineusers.$bindTo($scope, 'onlineusers');

  $scope.last_melody.$watch(function(event) {
    var melody = $scope.last_melody[0];
    if (melody && $scope.profile) {
      if ($scope.profile.uid != melody.uid) {
        Player(melody.name, melody.location, melody.melody);
        if ($scope.isRecording) {
          // console.log('record other');
          // console.log(melody);
          $scope.activeRec.push({melody: melody.melody, name: melody.name, uid: melody.uid, user: melody.user, time: $scope.time, location: melody.location});
        }
      }
    }
  });
  $scope.playSound = function(melody) {
    $scope.selected = melody;
    Player(name, $scope.instrument.location, melody);
    $scope.harmony.$add({melody: melody, name: name, location: $scope.instrument.location, uid: $scope.profile.uid, user: $scope.profile});
    //record
    if ($scope.isRecording) {
      $scope.activeRec.push({melody: melody, name: name, uid: $scope.profile.uid, user: $scope.profile, time: $scope.time, location: $scope.instrument.location});
    }
  }
  $scope.sound = function(melody) {
    $scope.holded = true;
    $scope.playSound(melody);
    var userRef = fbutil.ref('presences', $scope.user.uid);
    userRef.update({sounded: true});
    if (!timer) {
      timer = $interval(function() {
        $scope.playSound(melody);
      }, delay);
    } 
  }
  $scope.enter = function(melody) {
    if ($scope.holded) {
      $scope.sound(melody);
    }
  }
  $scope.stop = function() {
    $scope.holded = false;
    var userRef = fbutil.ref('presences', $scope.user.uid);
    userRef.update({sounded: false});
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }
  $scope.leave = function() {
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }
  var shake = new Shake({
    frequency: 300,                                                //milliseconds between polls for accelerometer data.
    waitBetweenShakes: 1000,                                       //milliseconds to wait before watching for more shake events.
    threshold: 12,                                                 //how hard the shake has to be to register.
    success: function(magnitude, accelerationDelta, timestamp) {
      Player($scope.name, $scope.instrument.location, $scope.selected);   
      $scope.harmony.$add({melody: $scope.selected, name: $scope.name, uid: $scope.profile.uid});
    }, //callback when shake is detected. "this" will be the "shake" object.
    failure: function() {},                                        //callback when watching/getting acceleration fails. "this" will be the "shake" object.
  });
  shake.startWatch();

    //Partitiur
  $scope.usingPartitur = false;
  $scope.partiturs = Partiturs.partiturs;
  $scope.doTimer = function() {
    $scope.time++;
    if ($scope.time % 8 == 0) {
      if ($scope.user.uid == $scope.presences[0].uid) {
        var songRef = fbutil.ref('song');
        songRef.update({time: $scope.time});
      }
    }
    if ($scope.time > ($scope.settings.currentSong.melody.length + 10) * 5 ) {
      $scope.time = 0;
    }
  };
  
  $scope.changeSong = function() {
    $scope.time = 0;
    $scope.settings.currentSong.time = 0;
    $scope.settings.currentSong.tempo = $scope.settings.tempo;
    //update info song
    if ($scope.user.uid == $scope.presences[0].uid) {
      var songRef = fbutil.ref('song');
      songRef.update($scope.settings.currentSong);
    }
  };

  $scope.isPlaying = false;

  $scope.switch = function() {
    $scope.usingPartitur = !$scope.usingPartitur;
    $ionicScrollDelegate.resize();
  }

  $scope.settings = {
    notes: false,
    tempo: 150,
    tempoVal: 70,
    currentSong : {melody: [], title: 'Song', source: '-', id:0}
  };
  $scope.converter = {
    'da2' : '1',
    'la' : '3',
    'ti' : '4',
    'na' : '5',
    'mi' : '7',
    'da' : '1\'',
  };
  $scope.notes = function(melody) {
    if ($scope.settings.notes) {
      if ($scope.converter[melody.toLowerCase()] != null)
        return $scope.converter[melody.toLowerCase()];
      else
        return melody.toUpperCase();
    } else {
      return melody.toUpperCase();
    }
  }
  
  $scope.control = function() {
    $scope.controlPlay();
    $scope.last_songEvent.$add({state: $scope.isPlaying, time: $scope.time});
  };
  $scope.controlPlay = function() {
    $scope.isPlaying = !$scope.isPlaying;
    if ($scope.isPlaying) {
      if ( angular.isDefined(timer2) ) return;
      timer2 = $interval($scope.doTimer, $scope.settings.tempo); 
    } else {
      if (angular.isDefined(timer2)) {
        $interval.cancel(timer2);
        timer2 = undefined;
      }  
    }
  };
  
  $scope.tempoChange = function() {
    if ($scope.isPlaying) {
      // console.log($scope.settings.tempo);
      $scope.settings.tempo = 400 - ($scope.settings.tempoVal / 100 * 400);
      $interval.cancel(timer2);
      timer2 = $interval($scope.doTimer, $scope.settings.tempo);
      //remote
      $scope.song.tempo = $scope.settings.tempo;
    }
  };

  $scope.song = fbutil.syncObject('song');
  $scope.songId = 0;
  // song.$bindTo($scope, 'song');
  var unwatch = $scope.song.$watch(function() {
    console.log($scope.song.id);
    if ($scope.song) {
      if ($scope.songId != $scope.song.id) {
        $scope.songId = $scope.song.id;
        $scope.usingPartitur = true;
        $ionicScrollDelegate.resize();

        $scope.song.tempo = $scope.settings.tempo;
        $scope.isPlaying = false;
        $scope.controlPlay();

        $scope.time = $scope.song.time-1;
        var curSong = Partiturs.find($scope.song.id);
        if (curSong)
          $scope.settings.currentSong = curSong;
      }
    }
  }, function() {return $scope.song.id});

  $scope.last_songEvent = fbutil.syncArray(['song', 'events'], {limit: 1});
  $scope.last_songEvent.$watch(function() {
    var object = $scope.last_songEvent[0];
    if (object) {
      $scope.isPlaying = !object.state;
      $scope.time = object.time;
      $scope.controlPlay();
    }
  });

  $scope.activeRec = {};
  $scope.isRecording = false;

  $scope.$on('$destroy', function() {
    $interval.cancel(timer);
    timer = undefined;
    $interval.cancel(timer2);
    timer2 = undefined;
    $interval.cancel(timer3);
    timer3 = undefined;
    unwatch();
    shake.stopWatch();
  });

  //Record sound
  $scope.record = function() {
    $scope.isRecording = !$scope.isRecording;
    if ($scope.isRecording) {
      var recRef = fbutil.ref('record');
      var newRec = recRef.push({
        title: $scope.settings.currentSong.title,
        user: $scope.user.uid,
        avatar: $scope.profile.avatar,
        name: $scope.profile.name,
        like: 0,
        harmony: []
      });  
      console.log(newRec);
      $scope.activeRec = fbutil.ref('record', newRec.name(), 'harmony');
      $scope.isRecording = true;
    } else {
      alert('Stream successfully saved');
    }
  }
})

.controller('PlayGuestCtrl', function($scope, simpleLogin, Player, fbutil, $stateParams, Instruments, Shake, Partiturs, $interval, $ionicScrollDelegate) {
  var name = $stateParams.name;
  $scope.name = name;
  $scope.instrument = Instruments.find(name);
  $scope.selected = '';
  $scope.time = 0;
  $scope.tempo = 150;
  var timer, timer2, delay = 350;
  
  $scope.playSound = function(melody) {
    $scope.selected = melody;
    Player(name, $scope.instrument.location, melody);
  }
  $scope.sound = function(melody) {
    $scope.holded = true;
    $scope.playSound(melody);
    if (!timer) {
      timer = $interval(function() {
        $scope.playSound(melody);
      }, delay);
    } 
  }
  $scope.enter = function(melody) {
    if ($scope.holded) {
      $scope.sound(melody);
    }
  }
  $scope.stop = function() {
    $scope.holded = false;
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }
  $scope.leave = function() {
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }

  var shake = new Shake({
    frequency: 300,                                                //milliseconds between polls for accelerometer data.
    waitBetweenShakes: 1000,                                       //milliseconds to wait before watching for more shake events.
    threshold: 12,                                                 //how hard the shake has to be to register.
    success: function(magnitude, accelerationDelta, timestamp) {
      Player($scope.name, $scope.instrument.location, $scope.selected);   
    }, //callback when shake is detected. "this" will be the "shake" object.
    failure: function() {},                                        //callback when watching/getting acceleration fails. "this" will be the "shake" object.
  });
  shake.startWatch();
  $scope.$on('$destroy', function() {
    $interval.cancel(timer);
    timer = undefined;
    $interval.cancel(timer2);
    timer2 = undefined;
    shake.stopWatch();
  });

  //Partitiur
  $scope.usingPartitur = false;
  $scope.partiturs = Partiturs.partiturs;
  $scope.doTimer = function() {
    $scope.time++;
    if ($scope.time > ($scope.settings.currentSong.melody.length + 10) * 5 ) {
      $scope.time = 0;
    }
  };
  var timer;
  $scope.changeSong = function() {
    $scope.time = 0;
    console.log($scope.settings.currentSong);
    $scope.control();
  };

  $scope.switch = function() {
    $scope.usingPartitur = !$scope.usingPartitur;
    $ionicScrollDelegate.resize();
  }

  $scope.settings = {
    notes: false,
    tempo: 150,
    tempoVal: 70,
    currentSong : {melody: [], title: 'Song', source: '-'}
  };
  $scope.converter = {
    'da2' : '1',
    'la' : '3',
    'ti' : '4',
    'na' : '5',
    'mi' : '7',
    'da' : '1\'',
  };
  $scope.notes = function(melody) {
    if ($scope.settings.notes) {
      if ($scope.converter[melody.toLowerCase()] != '')
        return $scope.converter[melody.toLowerCase()];
      else
        return melody.toUpperCase();
    } else {
      return melody.toUpperCase();
    }
  }
  $scope.isPlaying = false;
  $scope.control = function() {
    $scope.isPlaying = !$scope.isPlaying;
    if ($scope.isPlaying) {
      if ( angular.isDefined(timer2) ) return;
      timer2 = $interval($scope.doTimer, $scope.settings.tempo); 
    } else {
      if (angular.isDefined(timer2)) {
        $interval.cancel(timer2);
        timer2 = undefined;
      }  
    }
  };
  $scope.tempoChange = function() {
    if ($scope.isPlaying) {
      // console.log($scope.settings.tempo);
      $scope.settings.tempo = 400 - ($scope.settings.tempoVal / 100 * 400);
      $interval.cancel(timer2);
      timer2 = $interval($scope.doTimer, $scope.settings.tempo);
    }
  }

})

.controller('LoginCtrl', function($scope, createProfile, simpleLogin, $state, $rootScope) {
  $rootScope.hide = false;
  $scope.login = function() {
    $scope.err = null;
      simpleLogin.login()
      .then(function( user ) {
        console.log(user);
        createProfile(user.uid, user.displayName, user.thirdPartyUserData.picture.data.url, 0).then(function() {
          $rootScope.hide = true;
          $rootScope.$broadcast('afterlogin');
          // $state.go('browse');
        });
      }, function(err) {
        $scope.err = errMessage(err);
      });
  }
  $scope.guest = function() {
    $rootScope.hide = true;
    // $state.go('browse');
  }
  function errMessage(err) {
    return angular.isObject(err) && err.code? err.code : err + '';
  }
})

.controller('MenuCtrl', function($scope, fbutil, requireUser, simpleLogin, $rootScope, $state) {
  $scope.load = function() {
    console.log('load');
    requireUser().then(function(user) {
      var profile = fbutil.syncObject(['users', user.uid]);
      profile.$bindTo($scope, 'profile').then(function(unbind) {
        $scope.unbind = unbind;
      });
    });
  }
  $scope.load();
  $scope.$on('afterlogin', $scope.load);
  $scope.logout = function() {
    if ($scope.profile) {
      console.log('exit');
      simpleLogin.logout();
      //reset profile
      $scope.unbind();
      $scope.profile = {
        $id: 0,
        avatar:'//:0'
      };
    }
    console.log('keluar');
    $rootScope.hide = false;
    // $state.go('login');
  }
  $scope.exit = function() {
    navigator.app.exitApp();
  }
})

.controller('BrowseCtrl', function($scope, Instruments) {
  $scope.instruments = Instruments.instruments;
  $scope.locations = [ 'sunda', 'jawa','bali','kalimantan','maluku','nusa','papua','sumatera',];
})

.controller('WikimoreCtrl', function($scope) {
  
})

.controller('DetailCtrl', function($scope, Instruments, $stateParams, $ionicScrollDelegate) {
  $scope.instrument = Instruments.find($stateParams.name);
  $scope.expanded = ['short', 'short', 'short'];
  $scope.expand = function(id) {
    if ($scope.expanded[id] == 'short') {
      $scope.expanded[id] = 'full';
    } else {
      $scope.expanded[id] = 'short';
    }
    $ionicScrollDelegate.resize();
  }

})

.controller('AboutCtrl', function($scope) {
  
})

.controller('SongCtrl', function($scope,Partiturs) {
  $scope.partiturs = Partiturs.partiturs;
  $scope.locations = ['Jawa Tengah','Jakarta','Maluku','Jawa Barat','Nusa Tenggara Timur','Yogyakarta','Papua'];
})

.controller('LyricCtrl', function($scope,Partiturs, $stateParams) {
  $scope.partitur = Partiturs.find($stateParams.id);
  console.log($scope.partitur);
})


.controller('ChooseCtrl', function($scope,Partiturs, Instruments, $stateParams){
  $scope.instruments = Instruments.instruments;
  $scope.locations = ['sunda', 'jawa','bali','kalimantan','maluku','nusa','papua','sumatera',];
  $scope.partiturid = Partiturs.find($stateParams.id);
})

.controller('StreamCtrl', function($scope,Partiturs, $stateParams, fbutil, Player, $interval, $cordovaSocialSharing, $location){
  $scope.liked = false;
  $scope.isPlaying = false;

  $scope.stream = fbutil.syncObject(['record', $stateParams.id]);
  $scope.stream.$loaded(function() {
    console.log($scope.stream);
  });

  var timer;
  $scope.time = 0;
  $scope.last_time = 0;
  $scope.percent = 0;
  $scope.doTimer = function() {
    $scope.time++;
    var find = _.findWhere($scope.streamItem, {time: $scope.time});
    
    if ($scope.last_time > 0) {
      $scope.percent = Math.round($scope.time / $scope.last_time * 100);
    }
    
    if (find) {
      console.log('bunyi');
      Player(find.name, find.location, find.melody);
    }
    if ($scope.time > $scope.last_time) {
      $scope.time = 0;
    }
  }
  $scope.streamItem = fbutil.syncArray(['record', $stateParams.id, 'harmony']);
  $scope.streamItem.$loaded(function() {
    var last = _.max($scope.streamItem, function(item) { return item.time });
    $scope.last_time = last.time + 10;
    $scope.users = _.uniq(_.pluck($scope.streamItem, 'user'), function(item) {
      return item.name;
    });
    console.log($scope.users);
    // var first = _.first($scope.streamItem);
    // $scope.first_time = first.time - 5;
  });
  $scope.share = function(){
    $cordovaSocialSharing
    .shareViaFacebook("Listen to my stream on inklusik ", null, "http://sonnylazuardi.github.com/inklusik/www/#"+$location.path())
    .then(function(result) {
      alert('Sharing succeed.');
    }, function(err) {
      alert('Sharing failed.');
    });
  }
  $scope.toggleLike = function(){
    $scope.liked = !$scope.liked;
    if ($scope.liked) {
      $scope.stream.like++;
      $scope.stream.$save();
    } else {
      $scope.stream.like--;
      $scope.stream.$save();
    }
  }
  $scope.togglePlay = function(){
    $scope.isPlaying = !$scope.isPlaying;
    if ($scope.isPlaying){
      // $scope.time = $scope.first_time;
      if ( angular.isDefined(timer) ) return;
      timer = $interval($scope.doTimer, 150); 
    } else {
      if (angular.isDefined(timer)) {
        $interval.cancel(timer);
        timer = undefined;
      }
    }
  }
  $scope.$on('$destroy', function() {
    $interval.cancel(timer);
    timer = undefined;    
  });
})

.controller('StreamListCtrl', function($scope, fbutil) {
  $scope.streams = fbutil.syncArray(['record']);

})


.controller('SearchCtrl', function($scope, Instruments){
  $scope.instruments = Instruments.instruments;
});



