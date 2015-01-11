angular.module('inklusik.services', [])

.service('Player', function(ngAudio, $cordovaMedia) {
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    var ctr = 1;
    function Player (name, region, url) {
        if (app) {
            var src = "/android_asset/www/sound/"+region+"/"+name+"/"+url+".mp3";

            var my_media = new Media(src, 
                function() { my_media.stop(); my_media.release();},
                function() { my_media.stop(); my_media.release();}); 
            my_media.play();
        } else {
            // console.log("sound/sunda/"+name+"/"+url+".mp3");
            ngAudio.play("sound/"+region+"/"+name+"/"+url+".mp3");
        }
    }
    return Player;
})

.service('Shake', function() {
    function Shake(options) {
      var shake = this,
        watchId = null,
        defaultOptions = {
          frequency: 300,
          waitBetweenShakes: 1000,
          threshold: 12,
          success: undefined,
          failure: undefined
        },
        previousAcceleration;
      for (var p in defaultOptions)
        if (!options.hasOwnProperty(p))
          options[p] = defaultOptions[p];
      
      // Start watching the accelerometer for a shake gesture
      shake.startWatch = function () {
        var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        if (app) {
          if (watchId)
            return;
          watchId = navigator.accelerometer.watchAcceleration(getAccelerationSnapshot, handleError, {
            frequency: options.frequency
          });
        }
      };
      
      // Stop watching the accelerometer for a shake gesture
      shake.stopWatch = function () {
        if (!watchId)
          return;
        navigator.accelerometer.clearWatch(watchId);
        watchId = null;
      };
      
      // Gets the current acceleration snapshot from the last accelerometer watch
      function getAccelerationSnapshot() {
        navigator.accelerometer.getCurrentAcceleration(assessCurrentAcceleration, handleError);
      }
      
      // Assess the current acceleration parameters to determine a shake
      function assessCurrentAcceleration(acceleration) {
        if (!previousAcceleration) {
          previousAcceleration = acceleration;
          return;
        }
        var accelerationDelta = {
          x: acceleration.x - previousAcceleration.x,
          y: acceleration.y - previousAcceleration.y,
          z: acceleration.z - previousAcceleration.z
        };
        var magnitude = Math.sqrt(
          Math.pow(accelerationDelta.x, 2) +
          Math.pow(accelerationDelta.y, 2) +
          Math.pow(accelerationDelta.z, 2)
        );
        if (magnitude >= options.threshold) {
          // Shake detected
          if (options.waitBetweenShakes > 0) {
            shake.stopWatch();
            previousAcceleration = undefined;
          }
          options.success.call(shake, magnitude, accelerationDelta, acceleration.timestamp);
          if (options.waitBetweenShakes > 0)
            setTimeout(
              function() {
                shake.startWatch();
              },
              options.waitBetweenShakes
            );
        }
        else
          previousAcceleration = acceleration;
      }
     
      // Handle errors here
      function handleError() {
        if (options.failure)
          options.failure.call(shake);
      }
    };
    return Shake;
})

.factory('Partiturs', function() {
  var self = this;
  self.partiturs = [
    {
      id: 1,
      title: 'Gundul Gundul Pacul',
      img: 'gundul-gundul-pacul.jpg',
      source: 'Jawa Tengah',
      lyric: '<p>Gundhul gundhul pacul cul<br>gembèlengan<br>Nyunggi nyunggi wakul kul<br>gembèlengan<br>Wakul nggilmpang segané dadi sak ratan<br>Wakul nggilmpang segané dadi sak ratan</p>',
      melody: [
        'da2', 'la', 'da2', 'la',  'ti', 'na', 'na', '0', 'mi', 'da', 'mi', 'da', 'mi', 'na', '0', '0', 'da2', 'la', 'da2', 'la', 'ti', 'na', 'na', '0', 'mi', 'da', 'mi', 'da', 'mi', 'na', '0', 'da2', '0', 'la', '0', 'na', '0', 'ti', 'ti', 'na', 'ti', 'la', 'da2', 'ti', 'la', 'da2', '0', '0', 'da2', '0', 'la', '0', 'na', '0', 'ti', 'ti', 'na', 'ti', 'la', 'da2', 'ti', 'la', 'da2', '0'
      ],
      tick: '4/4',
    }, {
      id: 2,
      title: 'Suwe Ora Jamu',
      img: 'suwe-ora-jamu.jpg',
      source: 'Yogyakarta',
      lyric: '<p>Suwe ora jamu, jamu godhong telo<br>Suwe ora ketemu, ketemu pisan gawe gelo<br>Suwe ora jamu, jamu godhong telo<br>Suwe ora ketemu, ketemu pisan gawe gelo</p>',
      melody: [
        '3', '4', '5', '0', '5', '3', '4', '5', '0', '0', '3', '4', '0', '4', '5', '3', '4', '0', '0', '5', '7' , '0', '7', '1\'', '1\'', '7', '0', '7', '6', '6', '4', '0', '4', '3', '3', '1\'', '0', '0', '3', '4', '5', '0', '5', '3', '4', '5', '0', '0', '3', '4', '0', '4', '5', '3', '4', '0', '0', '5', '7' , '0', '7', '1\'', '1\'', '7', '0', '7', '6', '6', '4', '0', '4', '3', '3', '1\'', '0', '0'
      ],
      tick: '4/4',
    }, {
      id: 3,
      title: 'Apuse',
      img: 'apuse.jpg',
      source: 'Papua',
      lyric: '<p>Apuse kokondao yarabe soren Doreri Doreri<br>Wuf lenso ba ri ne ma ba ki Pa se<br>Apuse kokondao yarabe soren Doreri<br>Wuf lenso ba ni ne ma ba ki pa se<br>Rafabye aswarakwar rafabye, aswarakwar</p>',
      melody: [
        '5', '1', '3', '0', '2', '3', '2', '1', '0', '5', '1', '3', '0', '3', '2', '3', '4', '2', '0', '5', '1', '2', '4', '5', '0', '4', '3', '2', '3', '0', '2', '1', '0', '0', '0', '1', '0', '5', '1', '3', '0', '2', '3', '0', '2', '1', '0', '5', '1', '3', '0', '3', '2', '3', '4', '2', '0', '5', '1', '2', '0', '4', '5', '0', '4', '3', '0', '2', '3', '0', '2', '1', '0', '0', '0', '0', '5', '1', '4', '3', '0', '0', '0', '0', '5', '7', '2', '1', '1', '0', '0', '0', '0', '5', '1', '4', '3', '0', '0', '0', '0', '5', '7', '2', '1', '0', '0', '0', '1', '0'
      ],
      tick: '2/4',
    }, {
      id: 4,
      title: 'Anak Kambing Saya',
      img: 'anak-kambing-saya.jpg',
      source: 'Nusa Tenggara Timur',
      lyric: '<p>Mana di mana anak kambing saya<br>Anak kambing tuan ada di pohon waru<br>Mana di mana jantung hati saya<br>jantung hati tuan ada di kampung baru<br>Caca marica hehei, caca marica hehei<br>Caca marica ada di kampung baru</p>',
      melody: [
        '1', '1', '1', '1', '1', '0', '7', '6', '1', '7', '6', '5', '0', '5', '2', '2', '2', '2', '2', '2', '3', '4', '3', '2', '1', '0', '1', '1', '1', '1', '1', '0', '7', '6', '1', '7', '6', '5', '0', '5', '2', '2', '2', '2', '1', '2', '3', '4', '3', '2', '1', '0', '4', '4', '4', '4', '4', '6', '6', '3', '3', '3', '3', '3', '5', '5', '2', '2', '2', '2', '2', '1', '2', '3', '4', '3', '2', '1', '0', '4', '4', '4', '4', '4', '6', '6', '3', '3', '3', '3', '3', '5', '2', '2', '2', '2', '2', '1', '2', '3', '4', '3', '2', '1', '0'
      ],
      tick: '4/4',
    }, {
      id: 5,
      title: 'Buka Pintu',
      img: 'buka-pintu.jpg',
      source: 'Maluku',
      lyric: '<p>Buka pintu buka pintu beta mau mau masuke<br>Sio lah nona nona beta adalah dimukae<br>Beta panggil tidak menyahut<br>buka pintu juga tidak mau<br>Sio lah nona beta mau masuke hehe hehe<br>Beta panggil tidak menyahut buka pintu juga tidak mau<br>Buka pintu beta mau masuke</p>',
      melody: [
        '5', '4', '3', '5', '1', '3', '5', '1', '0', '3', '5', '4', '4', '4', '3', '4', '3', '2', '0', '0', '4', '3', '2', '4', '7', '2', '5', '7', '0', '5', '5', '5', '0', '0', '6', '5', '4', '3', '0', '0', '5', '5', '6', '6', '6', '5', '6', '5', '4', '0', '0', '4', '0', '0', '6', '6', '5', '5', '5', '4', '3', '0', '0', '4', '3', '5', '2', '0', '0', '2', '3', '4', '4', '3', '2', '3', '0', '1', '3', '0', '5', '7', '0', '0', '5', '5', '6', '6', '6', '5', '6', '5', '4', '0', '0', '4', '0', '0', '6', '6', '5', '5', '5', '4', '3', '0', '0', '4', '3', '5', '2', '0', '0', '2', '3', '4', '4', '3', '7', '0', '2', '1', '0', '0', '0', '1', '0', '0', '0'
      ],
      tick: '4/4',
    }, {
      id: 6,
      title: 'Burung Kakatua',
      img: 'burung-kakatua.jpg',
      source: 'Maluku',
      lyric: '<p>Burung Kakak Tua. Hinggap di jendela<br>Nenek sudah tua. Giginya tinggal dua<br>Tredung, tredung, terdung tra la la<br>Tredung, tredung, terdung tra la la<br>Tredung, tredung, terdung tra la la<br>Tredung, tredung, terdung tra la la<br>Burung kakak tua.</p>',
      melody: [
        '5', '5', '3', '1\'', '3', '2', '0', '3', '4', '6', '5', '4', '3', '5', '5', '3', '1\'', '3', '2', '0', '7', '6', '1\'', '4', '3', '2', '1', '3', '5', '3', '5', '5', '6', '6', '6', '6', '3', '5', '3', '5', '5', '6', '6', '6', '6', '3', '5', '3', '5', '5', '6', '6', '6', '6', '3', '5', '3', '5', '5', '6', '6', '6', '6', '1\'', '7', '5', '6', '7', '1\'', '0', '0', '0'
      ],
      tick: '4/4',
    }, {
      id: 7,
      title: 'Ilir-Ilir',
      img: 'ilir-ilir.jpg',
      source: 'Jawa Tengah',
      lyric: '<p>Lir ilir lir ilir tandure wong sumilir<br>Tak iji royo-royo tak sengguh penganten anyar<br>Cah angon cah angon penekna blimbing kuwi<br>Lunyu lunyu peneken kanggo mbasuh dodotira dodotira dodotira kumitir bedah ing pinggir<br>Dondomana jrumatana kanggo seba mengko sore<br>Mumpung padang rembulane mumpung jembar kalangane<br>Sun surakka surak hiyo</p>',
      melody: [
        '1\'', '1\'', '2\'', '3\'', '1\'', '1\'', '2\'', '3\'', '1\'', '1\'', '5', '5', '1\'', '1\'', '6', '5', '5', '5', '5', '1\'', '1\'', '6', '6', '3', '6', '5', '5', '2', '3', '1', '1\'', '1\'', '2\'', '3\'', '1\'', '1\'', '2\'', '3\'', '1\'', '1\'', '5', '5', '1\'', '1\'', '6', '5', '5', '5', '5', '1\'', '1\'', '6', '6', '3', '6', '5', '3', '2', '3', '1', '1\'', '1\'', '1\'', '2\'', '3\'', '1\'', '1\'', '1\'', '2\'', '3\'', '1\'', '1\'', '1\'', '5', '5', '1\'', '1\'', '6', '5', '5', '5', '5', '5', '1\'', '1\'', '6', '6', '3', '6', '5', '3', '2', '3', '1', '1', '2', '3', '5', '3', '2', '3', '1', '1', '2', '3', '5', '3', '2', '3', '1', '1\'', '1\'', '5', '6', '5', '6', '1\'', '3', '6', '5', '0', '3', '2', '1', '2', '3', '2', '1', '0', '0'
      ],
      tick: '4/4',
    }, {
      id: 8,
      title: 'Kicir-Kicir',
      img: 'kicir-kicir.jpg',
      source: 'Jakarta',
      lyric: '<p>Kicir kicir ini lagunya lagu lama ya tuan dari Jakarta<br>Saya menyanyi ya tuan memang sengaja untuk menghibur menghibur hati nan duka<br>Burung dara burung merpati terbang cepat ya tuan tiada tara<br>Bilalah kita ya tuan suka menyanyi badanlah sehat ya tuan hati gembira<br>Buah mangga enak rasanya si manalagi ya tuan paling ternama<br>Siapa saya ya tuan rajin bekerja pasti menjadi menjadi warga berguna</p>',
      melody: [
        '0', '3', '3', '5', '3', '0', '2', '2', '2', '4', '3', '2', '0', '3', '3', '3', '5', '6', '0', '5', '3', '3', '0', '1', '1', '1', '6', '1', '0', '0', '6', '6', '1', '2', '3', '0', '1', '1', '1', '0', '5', '5', '1', '2', '6', '0', '0', '6', '6', '1', '2', '3', '0', '1', '1', '1', '0', '5', '5', '7', '6', '5', '0', '0', '3', '3', '5', '3', '0', '2', '2', '2', '4', '3', '2', '0', '3', '3', '3', '5', '6', '0', '5', '3', '3', '0', '1', '1', '1', '6', '1', '0', '0', '6', '6', '1', '2', '3', '0', '1', '1', '1', '0', '5', '5', '1', '2', '6', '0', '0', '6', '6', '1', '2', '3', '0', '1', '1', '1', '0', '5', '5', '7', '6', '5', '0', '0', '3', '3', '5', '3', '0', '2', '2', '2', '4', '3', '2', '0', '3', '3', '3', '5', '6', '0', '5', '3', '3', '0', '1', '1', '1', '6', '1', '0', '0', '6', '6', '1', '2', '3', '0', '1', '1', '1', '0', '5', '5', '1', '2', '6', '0', '0', '6', '6', '1', '2', '3', '0', '1', '1', '1', '0', '5', '5', '7', '6', '5', '0'
      ],
      tick: '4/4',
    }, {
      id: 9,
      title: 'Manuk Dadali',
      img: 'manuk-dadali.jpg',
      source: 'Jawa Barat',
      lyric: '<p>Mesat ngapung luhur jauh di awanga wang<br>Meberkeun janjangna bangun taya karingrang<br>Kukuna ranggaos rejeung pamatukna ngeluk<br>Ngapak mega bari hibernatarik nyuruwuk<br>Sahaanubisa nyusul kana tandangna gandang jeung partentang taya bandingannana<br>Dipika gimir dipika serab ku sasama<br>Tayakarempan ka sieun leber wawanenna Manuk Dadali</p>',
      melody: [
        '0', '5', '3', '4', '5', '7', '1\'', '7', '1\'', '3', '4', '5', '5', '5', '0', '5', '3', '4', '5', '7', '1\'', '7', '1\'', '3', '4', '5', '4', '4', '0', '5', '4', '3', '1', '7', '1', '3', '4', '5', '1', '3', '4', '4', '4', '0', '5', '4', '3', '1', '7', '1', '3', '4', '5', '1', '3', '1', '1', '1', '0', '5', '3', '4', '5', '7', '1\'', '7', '1\'', '3', '4', '5', '5', '5', '0', '5', '3', '4', '5', '7', '1\'', '7', '1\'', '3', '4', '5', '4', '4', '0', '5', '4', '3', '1', '7', '1', '3', '4', '5', '1', '3', '4', '4', '4' ,'0', '5', '4', '3', '1', '7', '1', '3', '4', '5', '1', '3', '1', '1', '1', '0', '0', '1', '4', '5', '6', '4', '5'
      ],
      tick: '4/4',
    }, {
      id: 10,
      title: 'Surilang',
      img: 'surilang.jpg',
      source: 'Jakarta',
      lyric: '<p>Buah semangka makanan raja,<br>buah kenari keras kulitnya<br>Buah semanggka makanan raja,<br>hei dayang disayang<br>Bertemu muka tidak sengaja aduh sayang<br>Hei sayang aduh sayang kalau dicari susah dapatnya<br>Di sana gunung di sini gunung,<br>ditengah-tengahnya bunga melati<br>Di sana gunung di sini gunung<br>hei sayang disayang<br>Di sana bingung di sini bingung aduh sayang<br>Hei sayang aduh sayang yang karna tergoda si jantung hati<br>Layang-layang terbang melayang<br>jatuh dipengki daimbil orang<br>Layang-layang terbang melayang<br>hei sayang-disayang<br>Siapa bilang tidak disayang aduh sayang<br>Hei sayang aduh sayang siang malam terbayang-bayang</p>',
      melody: [
        '0', '5', '5', '1', '2', '3', '4', '3', '4', '6', '5', '0', '0', '0', '0', '5', '5', '1', '2', '3', '4', '3', '4', '6', '5', '0', '0', '0', '0', '5', '5', '1', '2', '3', '4', '3', '4', '6', '5', '0', '0', '0', '0', '2', '2', '2', '4', '3', '1', '0', '0', '0', '0', '6', '6', '6', '7', '7', '4', '3', '4', '5', '6', '6', '5', '4', '3', '2', '0', '0', '2', '2', '3', '4', '5', '5', '5', '3', '6', '5', '3', '6', '5', '0', '5', '3', '1', '5', '0', '2', '2', '2', '2', '2', '2', '2', '4', '3', '1', '0', '0', '0', '0', '3', '4', '5', '3', '1', '6', '5', '0', '0', '0'
      ],
      tick: '4/4',
    }];
  self.find = function(id) {
    var wew =  _.findWhere(self.partiturs, {id : parseInt(id)});
    return wew;
  }
  return self;
})

.factory('Instruments', function() {
    var self = this;
    self.instruments = [ {
    description : "<p>Angklung adalah alat musik <strong>multitonal</strong> (bernada ganda) yang secara tradisional berkembang dalam masyarakat Sunda di Pulau Jawa bagian barat. Alat musik ini dibuat dari bambu, dibunyikan dengan cara digoyangkan (bunyi disebabkan oleh benturan badan pipa bambu) sehingga menghasilkan bunyi yang bergetar dalam susunan nada 2, 3, sampai 4 nada dalam setiap ukuran, baik besar maupun kecil.</p><p>Dictionary of the Sunda Language karya Jonathan Rigg, yang diterbitkan pada tahun 1862 di Batavia, menuliskan bahwa angklung adalah alat musik yang terbuat dari pipa-pipa bambu, yang dipotong ujung-ujungnya, menyerupai pipa-pipa dalam suatu organ, dan diikat bersama dalam suatu bingkai, digetarkan untuk menghasilkan bunyi. Angklung terdaftar sebagai <strong>Karya Agung Warisan Budaya Lisan</strong> dan <strong>Nonbendawi Manusia</strong> dari UNESCO sejak November 2010.</p>",
    howtoplay : "<p>Memainkan sebuah angklung sangat mudah. Seseorang tinggal memegang rangkanya pada salah satu tangan (biasanya tangan kiri) sehingga angklung tergantung bebas, sementara tangan lainnya (biasanya tangan kanan) <strong>menggoyangnya</strong> hingga berbunyi.</p>",
    image : "angklung.jpg",
    imagecover: "angklung-cover.jpg",
    location : "sunda",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "angklung",
    story : "<p>Tidak ada petunjuk sejak kapan angklung digunakan, tetapi diduga bentuk primitifnya telah digunakan dalam kultur Neolitikum yang berkembang di Nusantara sampai awal penanggalan modern, sehingga angklung merupakan bagian dari relik pra-Hinduisme dalam kebudayaan Nusantara. Catatan mengenai angklung baru muncul merujuk pada masa <strong>Kerajaan Sunda</strong> (abad ke-12 sampai abad ke-16).</p><p>Asal usul terciptanya musik bambu, seperti angklung berdasarkan pandangan hidup masyarakat Sunda yang agraris dengan sumber kehidupan dari padi (pare) sebagai makanan pokoknya. Hal ini melahirkan mitos kepercayaan terhadap Nyai Sri Pohaci sebagai lambang Dewi Padi pemberi kehidupan (hirup-hurip). Masyarakat Baduy, yang dianggap sebagai sisa-sisa masyarakat Sunda asli, menerapkan angklung sebagai bagian dari <strong>ritual mengawali penanaman padi</strong>.</p><p>Permainan angklung gubrag di Jasinga, Bogor, adalah salah satu yang masih hidup sejak lebih dari 400 tahun lampau. Kemunculannya berawal dari ritus padi. Angklung diciptakan dan dimainkan untuk memikat Dewi Sri turun ke bumi agar tanaman padi rakyat tumbuh subur. Jenis bambu yang biasa digunakan sebagai alat musik tersebut adalah bambu hitam (awi wulung) dan bambu putih (awi temen). Tiap nada (laras) dihasilkan dari bunyi tabung bambunya yang berbentuk bilah (wilahan) setiap ruas bambu dari ukuran kecil hingga besar. Dikenal oleh masyarakat sunda sejak masa kerajaan Sunda, di antaranya sebagai penggugah semangat dalam pertempuran. Fungsi angklung sebagai pemompa semangat rakyat masih terus terasa sampai pada masa penjajahan, itu sebabnya pemerintah Hindia Belanda sempat melarang masyarakat menggunakan angklung, pelarangan itu sempat membuat popularitas angklung menurun dan hanya dimainkan oleh anak- anak pada waktu itu.</p><p>Selanjutnya lagu-lagu persembahan terhadap Dewi Sri tersebut disertai dengan pengiring bunyi tabuh yang terbuat dari batang-batang bambu yang dikemas sederhana yang kemudian lahirlah struktur alat musik bambu yang kita kenal sekarang bernama angklung. Demikian pula pada saat pesta panen dan seren taun dipersembahkan permainan angklung. Terutama pada penyajian Angklung yang berkaitan dengan upacara padi, kesenian ini menjadi sebuah pertunjukan yang sifatnya arak-arakan atau helaran, bahkan di sebagian tempat menjadi iring-iringan Rengkong dan Dongdang serta Jampana (usungan pangan) dan sebagainya. Dalam perkembangannya, angklung berkembang dan menyebar ke seantero Jawa, lalu ke Kalimantan dan Sumatera. Pada 1908 tercatat sebuah misi kebudayaan dari Indonesia ke Thailand, antara lain ditandai penyerahan angklung, lalu permainan musik bambu ini pun sempat menyebar di sana. Bahkan, sejak 1966, Udjo Ngalagena &mdash;tokoh angklung yang mengembangkan teknik permainan berdasarkan laras-laras pelog, salendro, dan madenda&mdash; mulai mengajarkan bagaimana bermain angklung kepada banyak orang dari berbagai komunitas.</p>"
  }, {
    description : "<p>Kacapi merupakan alat musik Sunda yang dimainkan sebagai alat musik utama dalam <strong>Tembang Sunda</strong> atau Mamaos Cianjuran dan kacapi suling. Rincian unsur nada dalam sebuah kacapi parahu. Kata kacapi dalam bahasa Sunda juga merujuk kepada tanaman sentul, yang dipercaya kayunya digunakan untuk membuat alat musik kacapi.</p>",
    howtoplay : "<p>Kecapi merupakan alat musik petik yang menghasilkan suara ketika senar digetarkan. Tinggi rendah nada dihasilkan dari panjang pendeknya dawai.</p>",
    image : "kacapi.jpg",
    imagecover: "kacapi-cover.jpg",
    location : "sunda",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "kacapi",
    story : "<p>Alat musik kacapi lebih dikenal berasal dari <strong>China</strong> sejak berabad-abad lalu. Alat berdawai ini menjadi pengiring tembang-tembang merdu. Tak hanya di China, musik kacapi juga banyak di gunakan oleh beberapa pemusik tradisional di tanah air. Seperti halnya kebudayaan Sunda, alat kacapi merupakan alat musik kelasik yang selalu mewarnai beberapa kesenian di tanah Sunda ini.</p><p>Membuat kacapi bukanlah hal gampang.Meski sekilas tampak kacapi seperti alat musik sederhana, tetapi membuatnya tidaklah gampang. Untuk bahan bakunya saja terbuat dari kayu Kenanga yang terlebih dahulu direndam selama tiga bulan. Sedangkan senarnya, kalau ingin menghasilkan nada yang bagus, harus dari kawat suasa (logam campuran emas dan tembaga), seperti kacapi yang dibuat tempo dulu. Berhubung suasana saat ini harganya mahal, senar Kacapi sekarang lebih menggunakan kawat baja.</p>"
  }, {
    description : "<p>Kendang, kendhang, atau gendang adalah instrumen dalam <strong>gamelan Jawa Tengah</strong> yang salah satu fungsi utamanya mengatur irama. Instrument ini dibunyikan dengan tangan, tanpa alat bantu. Jenis kendang yang kecil disebut ketipung, yang menengah disebut kendang ciblon/kebar. Pasangan ketipung ada satu lagi bernama kendang gedhe biasa disebut kendang kalih.</p><p>Kendang kalih dimainkan pada lagu atau gendhing yang berkarakter halus seperti ketawang, gendhing kethuk kalih, dan ladrang irama dadi. Bisa juga dimainkan cepat pada pembukaan lagu jenis lancaran ,ladrang irama tanggung. Untuk wayangan ada satu lagi kendhang yang khas yaitu<strong> kendhang kosek</strong>. Kendang kebanyakan dimainkan oleh para pemain gamelan profesional, yang sudah lama menyelami budaya Jawa. Kendang kebanyakan di mainkan sesuai naluri pengendang, sehingga bila dimainkan oleh satu orang denga orang lain maka akan berbeda nuansanya.</p>",
    howtoplay : "<p>Secara umum, cara membunyikan ricikan kendhang adalah dengan dikebuk membrannya menggunakan telapak tangan atau jari jari tangan kanan dan kiri.</p>",
    image : "kendang.jpg",
    imagecover: "kendang-cover.jpg",
    location : "sunda",
    melody : [ "dung", "dung2", "tuk", "tung", "tungtaktung" ],
    name : "kendang",
    story : "<p>Menurut bukti sejarah, kelompok membranofon telah populer di Jawa sejak pertengahan abad ke-9 Masehi dengan nama: padahi, pataha (padaha), murawaatau muraba, mrdangga, mrdala, muraja, panawa, kahala, damaru, kendang. Istilah ‘padahi’ tertua dapat dijumpai pada prasasti Kuburan Candi yang berangka tahun 821 Masehi (Goris, 1930). Seperti yang tertulis pada kitab Nagarakrtagama gubahan Mpu Prapanca tahun 1365 Masehi (Pigeaud, 1960), istilah tersebut terus digunakan sampai dengan jaman Majapahit.</p>"
  }, {
    description : "<p>Akom adalah alat musik yang berbentuk seperti Angklung. Akan tetapi akom mempunyai ukuran yang lebih besar dan suara bass lebih terasa.</p>",
    howtoplay : "<p>Cara memainkannya seperti anglung. Seseorang tinggal memegang rangkanya pada salah satu tangan (biasanya tangan kiri) sehingga akom tergantung bebas, sementara tangan lainnya (biasanya tangan kanan) menggoyangnya hingga berbunyi.</p>",
    image : "akom.jpg",
    imagecover: "akom-cover.jpg",
    location : "sunda",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "akom",
    story : "<p>Tidak ada petunjuk sejak kapan akom digunakan, tetapi diduga bentuk primitifnya telah digunakan dalam kultur Neolitikum yang berkembang di Nusantara sampai awal penanggalan modern, sehingga akom merupakan bagian dari relik pra-Hinduisme dalam kebudayaan Nusantara. Catatan mengenai akom baru muncul merujuk pada masa Kerajaan Sunda (abad ke-12 sampai abad ke-16).</p><p>Asal usul terciptanya musik bambu, seperti akom berdasarkan pandangan hidup masyarakat Sunda yang agraris dengan sumber kehidupan dari padi (pare) sebagai makanan pokoknya. Hal ini melahirkan mitos kepercayaan terhadap Nyai Sri Pohaci sebagai lambang Dewi Padi pemberi kehidupan (hirup-hurip). Masyarakat Baduy, yang dianggap sebagai sisa-sisa masyarakat Sunda asli, menerapkan akom sebagai bagian dari ritual mengawali penanaman padi.</p><p>Permainan akom gubrag di Jasinga, Bogor, adalah salah satu yang masih hidup sejak lebih dari 400 tahun lampau. Kemunculannya berawal dari ritus padi. akom diciptakan dan dimainkan untuk memikat Dewi Sri turun ke bumi agar tanaman padi rakyat tumbuh subur. Jenis bambu yang biasa digunakan sebagai alat musik tersebut adalah bambu hitam (awi wulung) dan bambu putih (awi temen). Tiap nada (laras) dihasilkan dari bunyi tabung bambunya yang berbentuk bilah (wilahan) setiap ruas bambu dari ukuran kecil hingga besar.</p><p>Dikenal oleh masyarakat sunda sejak masa kerajaan Sunda, di antaranya sebagai penggugah semangat dalam pertempuran. Fungsi akom sebagai pemompa semangat rakyat masih terus terasa sampai pada masa penjajahan, itu sebabnya pemerintah Hindia Belanda sempat melarang masyarakat menggunakan akom, pelarangan itu sempat membuat popularitas akom menurun dan hanya dimainkan oleh anak- anak pada waktu itu.</p><p>Selanjutnya lagu-lagu persembahan terhadap Dewi Sri tersebut disertai dengan pengiring bunyi tabuh yang terbuat dari batang-batang bambu yang dikemas sederhana yang kemudian lahirlah struktur alat musik bambu yang kita kenal sekarang bernama akom. Demikian pula pada saat pesta panen dan seren taun dipersembahkan permainan akom. Terutama pada penyajian akom yang berkaitan dengan upacara padi, kesenian ini menjadi sebuah pertunjukan yang sifatnya arak-arakan atau helaran, bahkan di sebagian tempat menjadi iring-iringan Rengkong dan Dongdang serta Jampana (usungan pangan) dan sebagainya.</p><p>Dalam perkembangannya, akom berkembang dan menyebar ke seantero Jawa, lalu ke Kalimantan dan Sumatera. Pada 1908 tercatat sebuah misi kebudayaan dari Indonesia ke Thailand, antara lain ditandai penyerahan akom, lalu permainan musik bambu ini pun sempat menyebar di sana. Bahkan, sejak 1966, Udjo Ngalagena &mdash;tokoh akom yang mengembangkan teknik permainan berdasarkan laras-laras pelog, salendro, dan madenda&mdash; mulai mengajarkan bagaimana bermain akom kepada banyak orang dari berbagai komunitas.</p>"
  }, {
    description : "<p>Gangsa adalah nama salah satu instrumen dalam suatu ensembel atau barungan gambelan yang daun bilahannya terbuat dari perunggu. Banyak jenis barungan gambelan Bali yang mempergunakan gangsa, seperti umpamanya semara pagulingan, angklung, gong kebyar, gong gede,, gambang. Ada banyak lagi yang lain jika disebutkan satu persatu.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "gangsa-cover.jpg",
    location : "bali",
    melody : [ "dang", "deng", "ding", "dong", "dung" ],
    name : "gangsa",
    story : "<p>Gamelan Jegog berasal dari daerah Jembrana, yang memiliki keadaan tanah yang tidak rata. Keadaan alamnya kering, berbeda dengan daerah lainnya di Bali yang berupa pegunungan landai yang ditunjang oleh pertanian. Di Jembrana banyak tumbuh pohon bambu dengan ukuran yang besar-besar. Kondisi alam seperti itulah yang mendorong seniman di sana untuk menciptakan alat musik dari bambu. Kabupaten Jembrana terletak di Bali bagian barat. Di utara berbatasan dengan kabupaten Bulelang, di timur berbatasan dengan kabupaten Tabanan, di selatan berbatasan dengan samudra Hindia dan di barat dengan Selat Bali. Di Bali terdapat kurang lebih 28 jenis alat musik atau perangkat gamelan yang memiliki bentuk dan gending dengan warna suara, fungsi instrumentasi, karakter danrepertaire gending yang berbeda-beda. Jembrana terkenal dengan masyarakatnya yang menyukai perlombaan/ pertandingan, khususnya kesenian jegog, seperti mabarung (adu kendang), jegog mabarung (adu jegog), makepung (balapan kerbau), mabente (adu kaki),majengka (adu panco), dan mapentilan (adu nyentil jari). Sifat masyarakat yang gemar melakukan pertandingan tersebut terlihat pada bentuk kesenian/alat musiknya, seperti gamelan Jegog yang dibuat dengan ukuran yang besar agar tidak kalah tersaingi dengan alat musik lainnya. </p>"
  },{
    description : "<p>Gong adalah alat musik yang terbuat dari leburan logam (perunggu dengan tembaga)dengan permukaan yang bundar (dengan atau tanpa Pencu). Gong dapat di gantung pada bingkai atau diletakkan berjajar pada rak, atau bisa ditempatkan pada permukaan yang lunak seperti tikar. Selain itu ada juga gong genggam yang dimainkan sambil berjalan ataupunmenari. Gong yang memiliki suara rendah, ditabuh dengan pemukul kayu yang ujungnya di balut dengan karet, katun, atau benang. Sedangkan untuk permainan melodi diperankan olehgong kecil.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "gong-cover.jpg",
    location : "bali",
    melody : [ "besar", "kecil", "sedang" ],
    name : "gong",
    story : "<p>Gamelan Jegog berasal dari daerah Jembrana, yang memiliki keadaan tanah yang tidak rata. Keadaan alamnya kering, berbeda dengan daerah lainnya di Bali yang berupa pegunungan landai yang ditunjang oleh pertanian. Di Jembrana banyak tumbuh pohon bambu dengan ukuran yang besar-besar. Kondisi alam seperti itulah yang mendorong seniman di sana untuk menciptakan alat musik dari bambu. Kabupaten Jembrana terletak di Bali bagian barat. Di utara berbatasan dengan kabupaten Bulelang, di timur berbatasan dengan kabupaten Tabanan, di selatan berbatasan dengan samudra Hindia dan di barat dengan Selat Bali. Di Bali terdapat kurang lebih 28 jenis alat musik atau perangkat gamelan yang memiliki bentuk dan gending dengan warna suara, fungsi instrumentasi, karakter danrepertaire gending yang berbeda-beda. Jembrana terkenal dengan masyarakatnya yang menyukai perlombaan/ pertandingan, khususnya kesenian jegog, seperti mabarung (adu kendang), jegog mabarung (adu jegog), makepung (balapan kerbau), mabente (adu kaki),majengka (adu panco), dan mapentilan (adu nyentil jari). Sifat masyarakat yang gemar melakukan pertandingan tersebut terlihat pada bentuk kesenian/alat musiknya, seperti gamelan Jegog yang dibuat dengan ukuran yang besar agar tidak kalah tersaingi dengan alat musik lainnya. </p>"
  },{
    description : "<p>Kethuk serupa juga dengan bonang namun memiliki nada yang lebih rendah. Krthuk merupakan alat music gamelan yang memiliki jumlah paling sedikit yaitu dua. Seperti halnya gong, kethuk juga dimainkan sesekali, namun permainan kethuk bersamaan dengan permainan kenong. Biasanya pemain kedua  musik ini dengan pemukul pada tangan kanan memainkan kenong dan kiri memainkan kethuk.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "kethuk-cover.jpg",
    location : "bali",
    melody : [ "dang", "deng", "ding", "dong", "dung" ],
    name : "kethuk",
    story : "<p>Gamelan Jegog berasal dari daerah Jembrana, yang memiliki keadaan tanah yang tidak rata. Keadaan alamnya kering, berbeda dengan daerah lainnya di Bali yang berupa pegunungan landai yang ditunjang oleh pertanian. Di Jembrana banyak tumbuh pohon bambu dengan ukuran yang besar-besar. Kondisi alam seperti itulah yang mendorong seniman di sana untuk menciptakan alat musik dari bambu. Kabupaten Jembrana terletak di Bali bagian barat. Di utara berbatasan dengan kabupaten Bulelang, di timur berbatasan dengan kabupaten Tabanan, di selatan berbatasan dengan samudra Hindia dan di barat dengan Selat Bali. Di Bali terdapat kurang lebih 28 jenis alat musik atau perangkat gamelan yang memiliki bentuk dan gending dengan warna suara, fungsi instrumentasi, karakter danrepertaire gending yang berbeda-beda. Jembrana terkenal dengan masyarakatnya yang menyukai perlombaan/ pertandingan, khususnya kesenian jegog, seperti mabarung (adu kendang), jegog mabarung (adu jegog), makepung (balapan kerbau), mabente (adu kaki),majengka (adu panco), dan mapentilan (adu nyentil jari). Sifat masyarakat yang gemar melakukan pertandingan tersebut terlihat pada bentuk kesenian/alat musiknya, seperti gamelan Jegog yang dibuat dengan ukuran yang besar agar tidak kalah tersaingi dengan alat musik lainnya. </p>"
  },{
    description : "<p>Ugal merupakan instrumen dalam sebuah gamelan Bali. Ini adalah instrumen perunggu yang dimainkan oleh satu tangan dengan palu kecil. Biasanya ada sepuluh kunci, memberikan jangkauan maksimum yang mencakup sekitar dua oktaf. Seperti gangsa, mereka tergantung di atas resonator bambu disetel.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "ugal-cover.jpg",
    location : "bali",
    melody : [ "dang", "deng", "ding", "dong", "dung" ],
    name : "ugal",
    story : "<p>Gamelan Jegog berasal dari daerah Jembrana, yang memiliki keadaan tanah yang tidak rata. Keadaan alamnya kering, berbeda dengan daerah lainnya di Bali yang berupa pegunungan landai yang ditunjang oleh pertanian. Di Jembrana banyak tumbuh pohon bambu dengan ukuran yang besar-besar. Kondisi alam seperti itulah yang mendorong seniman di sana untuk menciptakan alat musik dari bambu. Kabupaten Jembrana terletak di Bali bagian barat. Di utara berbatasan dengan kabupaten Bulelang, di timur berbatasan dengan kabupaten Tabanan, di selatan berbatasan dengan samudra Hindia dan di barat dengan Selat Bali. Di Bali terdapat kurang lebih 28 jenis alat musik atau perangkat gamelan yang memiliki bentuk dan gending dengan warna suara, fungsi instrumentasi, karakter danrepertaire gending yang berbeda-beda. Jembrana terkenal dengan masyarakatnya yang menyukai perlombaan/ pertandingan, khususnya kesenian jegog, seperti mabarung (adu kendang), jegog mabarung (adu jegog), makepung (balapan kerbau), mabente (adu kaki),majengka (adu panco), dan mapentilan (adu nyentil jari). Sifat masyarakat yang gemar melakukan pertandingan tersebut terlihat pada bentuk kesenian/alat musiknya, seperti gamelan Jegog yang dibuat dengan ukuran yang besar agar tidak kalah tersaingi dengan alat musik lainnya. </p>"
  }, {
    description : "<p>Bonang merupakan kumpulan dari gong-gong kecil yan terkadang juga disebut dengan nama “pot” atau “ceret”), kesemuanya diletakkan dan disusun berjajar pada bingkai kayu (yang disebut “rancak”) dalam dua baris.  Baris pertama atau baris yang bagian disebut dengan nama Jaleran atau bisa juga disebut dengan  Brunjung, sedangkan baris yang kedua/bawah disebut dengan sebutan setren/dhempok.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "bonang-cover.jpg",
    location : "jawa",
    melody : [ "ji", "ro", "lu", "ma", "nem" ],
    name : "bonang",
    story : "<p>Awalnya, alat musik instrumen gamelan dibuat berdasarkan relief yang ada dalam Candi Borobudur pada abad ke-8. Dalam relief di candi tersebut, terdapat beberapa alat musik yang terdiri dari kendang, suling bambu, kecapi, dawai yang digesek dan dipetik, serta lonceng. Sejak itu, alat musik tersebut dijadikan sebagai alat musik dalam alunan musik gamelan jawa. Alat musik yang terdapat di relief Candi Borobudur tersebut digunakan untuk memainkan gamelan. Pada masa pengaruh budaya Hindu-Budha berkembang di Kerajaan Majapahit, gamelan diperkenalkan pada masyarakat Jawa di Kerajaan Majapahit. Konon, menurut kepercayaan orang Jawa, gamelan itu sendiri diciptakan oleh Sang Hyang Guru Era Saka, sebagai dewa yang dulu menguasai seluruh tanah Jawa. Sang dewa inilah yang menciptakan alat musik gong, yang digunakan untuk memanggil para dewa. Alunan musik gamelan jawa di daerah Jawa sendiri disebut karawitan. Karawitan adalah istilah yang digunakan untuk menyebutkan alunan musik gamelan yang halus</p>"
  },{
    description : "<p>Gender, adalah alat musik yang terdiri dari bilah-bilah metal yang ditegangkan dengan tali. Gender dapat dibedakan menjadi Gender Barung dan gender Panerus. Gender Barung memiliki bilah metal dengan ukuran sedang dalam keluarga Gender. Gender Barung memiliki titi nada satu oktaf lebih rendah dari Gender Panerus. Gender Panerus memiliki bilah-bilah yang paling kecil dalam keluarga Gender. Gender Panerus memiliki titi nada satu oktaf lebih tinggi daripada Gender Barung.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "gender-cover.jpg",
    location : "jawa",
    melody : [ "ji", "ro", "lu", "ma", "nem" ],
    name : "gender",
    story : "<p>Awalnya, alat musik instrumen gamelan dibuat berdasarkan relief yang ada dalam Candi Borobudur pada abad ke-8. Dalam relief di candi tersebut, terdapat beberapa alat musik yang terdiri dari kendang, suling bambu, kecapi, dawai yang digesek dan dipetik, serta lonceng. Sejak itu, alat musik tersebut dijadikan sebagai alat musik dalam alunan musik gamelan jawa. Alat musik yang terdapat di relief Candi Borobudur tersebut digunakan untuk memainkan gamelan. Pada masa pengaruh budaya Hindu-Budha berkembang di Kerajaan Majapahit, gamelan diperkenalkan pada masyarakat Jawa di Kerajaan Majapahit. Konon, menurut kepercayaan orang Jawa, gamelan itu sendiri diciptakan oleh Sang Hyang Guru Era Saka, sebagai dewa yang dulu menguasai seluruh tanah Jawa. Sang dewa inilah yang menciptakan alat musik gong, yang digunakan untuk memanggil para dewa. Alunan musik gamelan jawa di daerah Jawa sendiri disebut karawitan. Karawitan adalah istilah yang digunakan untuk menyebutkan alunan musik gamelan yang halus</p>"
  },{
    description : "<p>Kendang, kendhang, atau gendang adalah instrumen dalam gamelan Jawa Tengah yang salah satu fungsi utamanya mengatur irama. Instrument ini dibunyikan dengan tangan, tanpa alat bantu. Jenis kendang yang kecil disebut ketipung, yang menengah disebut kendang ciblon/kebar. Pasangan ketipung ada satu lagi bernama kendang gedhe biasa disebut kendang kalih. Kendang kalih dimainkan pada lagu atau gendhing yang berkarakter halus seperti ketawang, gendhing kethuk kalih, dan ladrang irama dadi. Bisa juga dimainkan cepat pada pembukaan lagu jenis lancaran ,ladrang irama tanggung. Untuk wayangan ada satu lagi kendhang yang khas yaitu kendhang kosek.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara ditabuh</p>",
    image : "placeholder.jpg",
    imagecover: "kendhang-cover.jpg",
    location : "jawa",
    melody : [ "dang", "dlang", "lung", "tak" ],
    name : "kendhang",
    story : "<p>Awalnya, alat musik instrumen gamelan dibuat berdasarkan relief yang ada dalam Candi Borobudur pada abad ke-8. Dalam relief di candi tersebut, terdapat beberapa alat musik yang terdiri dari kendang, suling bambu, kecapi, dawai yang digesek dan dipetik, serta lonceng. Sejak itu, alat musik tersebut dijadikan sebagai alat musik dalam alunan musik gamelan jawa. Alat musik yang terdapat di relief Candi Borobudur tersebut digunakan untuk memainkan gamelan. Pada masa pengaruh budaya Hindu-Budha berkembang di Kerajaan Majapahit, gamelan diperkenalkan pada masyarakat Jawa di Kerajaan Majapahit. Konon, menurut kepercayaan orang Jawa, gamelan itu sendiri diciptakan oleh Sang Hyang Guru Era Saka, sebagai dewa yang dulu menguasai seluruh tanah Jawa. Sang dewa inilah yang menciptakan alat musik gong, yang digunakan untuk memanggil para dewa. Alunan musik gamelan jawa di daerah Jawa sendiri disebut karawitan. Karawitan adalah istilah yang digunakan untuk menyebutkan alunan musik gamelan yang halus</p>"
  },{
    description : "<p>Alat ini berukuran sedang dan beroktaf tinggi. Seperti demung,  Saron memainkan balungan dalam wilayahnya yang terbatas. Pada teknik tabuhan imbal-imbalan, dua saron memainkan lagu jalin menjalin yang bertempo cepat. Seperangkat gamelan mempunyai dua Saron, tetapi ada gamelan yang mempunyai lebih dari dua saron.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "saronpanembung-cover.jpg",
    location : "jawa",
    melody : [ "ji", "ro", "lu", "ma", "nem" ],
    name : "saronpanembung",
    story : "<p>Awalnya, alat musik instrumen gamelan dibuat berdasarkan relief yang ada dalam Candi Borobudur pada abad ke-8. Dalam relief di candi tersebut, terdapat beberapa alat musik yang terdiri dari kendang, suling bambu, kecapi, dawai yang digesek dan dipetik, serta lonceng. Sejak itu, alat musik tersebut dijadikan sebagai alat musik dalam alunan musik gamelan jawa. Alat musik yang terdapat di relief Candi Borobudur tersebut digunakan untuk memainkan gamelan. Pada masa pengaruh budaya Hindu-Budha berkembang di Kerajaan Majapahit, gamelan diperkenalkan pada masyarakat Jawa di Kerajaan Majapahit. Konon, menurut kepercayaan orang Jawa, gamelan itu sendiri diciptakan oleh Sang Hyang Guru Era Saka, sebagai dewa yang dulu menguasai seluruh tanah Jawa. Sang dewa inilah yang menciptakan alat musik gong, yang digunakan untuk memanggil para dewa. Alunan musik gamelan jawa di daerah Jawa sendiri disebut karawitan. Karawitan adalah istilah yang digunakan untuk menyebutkan alunan musik gamelan yang halus</p>"
  },{
    description : "<p>Alat ini seperti saron biasa, namun Pemukul saron panerus lebih kecil dengan ujung lainnya yang lancip, sedangkan dua lainnya memiliki alat pemukul yang besar. Cara memainkannya pun berbeda.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "saronpanerus-cover.jpg",
    location : "jawa",
    melody : [ "ji", "ro", "lu", "ma", "nem" ],
    name : "saronpanerus",
    story : "<p>Awalnya, alat musik instrumen gamelan dibuat berdasarkan relief yang ada dalam Candi Borobudur pada abad ke-8. Dalam relief di candi tersebut, terdapat beberapa alat musik yang terdiri dari kendang, suling bambu, kecapi, dawai yang digesek dan dipetik, serta lonceng. Sejak itu, alat musik tersebut dijadikan sebagai alat musik dalam alunan musik gamelan jawa. Alat musik yang terdapat di relief Candi Borobudur tersebut digunakan untuk memainkan gamelan. Pada masa pengaruh budaya Hindu-Budha berkembang di Kerajaan Majapahit, gamelan diperkenalkan pada masyarakat Jawa di Kerajaan Majapahit. Konon, menurut kepercayaan orang Jawa, gamelan itu sendiri diciptakan oleh Sang Hyang Guru Era Saka, sebagai dewa yang dulu menguasai seluruh tanah Jawa. Sang dewa inilah yang menciptakan alat musik gong, yang digunakan untuk memanggil para dewa. Alunan musik gamelan jawa di daerah Jawa sendiri disebut karawitan. Karawitan adalah istilah yang digunakan untuk menyebutkan alunan musik gamelan yang halus</p>"
  }, {
    description : "<p>Alat musik tradisional yang berasal dari suku Dayak Kalimantan Tengah yaitu Gendang Dayak atau disebut juga Gendang Tunggal. Mempunyai ukuran agak besar dan panjang kira-kira satu atau dua meter dengan garis tengah mencapai 40 centimeter. Gendang Dayak atau dengan istilah lain juga Gandang Tatau terbuat dari kulit sapi, rusa atau ular sawah/piton (panganen). Pada bagian pangkal terbuka sebagai penguat suara ketika ditabuh.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara ditabuh</p>",
    image : "placeholder.jpg",
    imagecover: "genderang-cover.jpg",
    location : "kalimantan",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "genderang",
    story : "<p></p>"
  }, {
    description : "<p>Kolintang atau kulintang adalah alat musik yang terdiri dari barisan gong kecil yang diletakkan mendatar. Alat musik ini dimainkan dengan diiringi oleh gong tergantung yang lebih besar dan drum. Kolintang merupakan bagian dari budaya gong Asia Tenggara, yang telah dimainkan selama berabad-abad di Kepulauan Melayu Timur - Filipina, Indonesia Timur, Malaysia Timur, Brunei, dan Timor. Alat musik ini berkembang dari tradisi pemberian isyarat sederhana menjadi bentuk seperti sekarang. Kegunaannya bergantung pada peradaban yang menggunakannya. Dengan pengaruh dari Hindu, Buddha, Islam, Kristen, dan Barat, Kulintang merupakan tradisi gong yang terus berkembang. Alat musik ini dibuat dari kayu lokal yang ringan namun kuat seperti telur, bandaran, wenang, kakinik kayu cempaka, dan yang mempunyai konstruksi fiber paralel. Nama kolintang berasal dari suaranya: tong (nada rendah), ting (nada tinggi) dan tang (nada biasa). Dalam bahasa daerah, ajakan 'Mari kita lakukan TONG TING TANG' adalah: ' Mangemo kumolintang'. Ajakan tersebut akhirnya berubah menjadi kata kolintang.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "kolintang-cover.jpg",
    location : "maluku",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "kolintang",
    story : "<p>Pada mulanya kolintang hanya terdiri dari beberapa potong kayu yang diletakkan berjejer diatas kedua kaki pemainnya dengan posisi duduk di tanah, dengan kedua kaki terbujur lurus kedepan. Dengan berjalannya waktu kedua kaki pemain diganti dengan dua batang pisang, atau kadang-kadang diganti dengan tali seperti arumba dari Jawa Barat. Sedangkan penggunaan peti sesonator dimulai sejak Pangeran Diponegoro berada di Minahasa (th.1830). Pada saat itu, konon peralatan gamelan dan gambang ikut dibawa oleh rombongannya.Adapun pemakaian kolintang erat hubungannya dengan kepercayaan tradisional rakyat Minahasa, seperti dalam upacara-upacara ritual sehubungan dengan pemujaan arwah para leluhur. Itulah sebabnya dengan masuknya agama kristen di Minahasa, eksistensi kolintang demikian terdesak bahkan hampir menghilang sama sekali selama ± 100th. Sesudah Perang Dunia II, barulah kolintang muncul kembali yang dipelopori oleh Nelwan Katuuk (seorang yang menyusun nada kolintang menurut susunan nada musik universal). Pada mulanya hanya terdiri dari satu Melody dengan susunan nada diatonis, dengan jarak nada 2 oktaf, dan sebagai pengiring dipakai alat-alat 'string' seperti gitar, ukulele dan stringbas. Tahun 1954 kolintang sudah dibuat  2 ½ oktaf (masih diatonis). Pada tahun 1960 sudah mencapai 3 ½ oktaf dengan nada 1 kruis, naturel, dan 1 mol. Dasar nada masih terbatas pada tiga kunci (Naturel, 1 mol, dan 1 kruis) dengan jarak nada 4 ½ oktaf dari F s./d. C. Dan pengembangan musik kolintang tetap berlangsung baik kualitas alat, perluasan jarak nada, bentuk peti resonator (untuk memperbaiki suara), maupun penampilan. Saat ini  Kolintang yang dibuat sudah mencapai 6 (enam) oktaf dengan chromatisch penuh.</p>"
  },
  {
    description : "<p> Alat musik ini terbuat dari bambu. Alat musik ini dimainkan lebih dari 30 orang dalam bentuk akord suara 1,2,3,4. Cara mempergunakannya sama dengan di dunia barat, sebab memiliki suara sopran, alto, tenor dan bass. Suling ini merupakan alat musik impor yang mendapat pengaruh bangsa Portugis dan Belanda yang sangat digemari masyarakat tradisional. Alat musik ini dibuat dari seruas bambu yang salah satu ujungnya diberi penyekat sesuai dengan diameter suling yang dilengkapi dengan 6 lubang nada dan satu lubang tiup. Permainan musik ini ditampilkan pada saat penyambutan tamu, pengiring orkes, resepsi, dan pengiring lagu gerejawi. Selain itu, suling dapat dipadukan dengan alat musik tradisional lain dan alat musik modern.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara ditiup</p>",
    image : "placeholder.jpg",
    imagecover: "sulingmaluku-cover.jpg",
    location : "maluku",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "suling_maluku",
    story : "<p> Kebudayaan merupakan hasil interaksi antara manusia dengan Tuhannya, antara manusia dengan sesamanya, dan antara manusia dengan alam dimana mereka hidup. Oleh karena pola-pola interaksi yang terjadi berbeda, maka kebudayaan yang dihasilkan berbeda-beda dan mempunyai keunikan masing-masing. Salah satu kebudayaan yang cukup unik tersebut adalah Musik Bambu. Musik tradisional ini merupakan salah satu kesenian tradisional Masyarakat Halmahera, Maluku Utara. Menurut Tengku Ryo, musik tradisional lahir dari proses panjang interaksi manusia dengan alam. Oleh karena alam yang menjadi sumper inspirasi berbeda-beda, maka musik yang dihasilkannya pun berbeda-beda, tidak hanya pada bunyi-bunyiannya, tetapi juga pada alat musik yang digunakannya. Lebih lanjut, Tengku Ryo mengatakan bahwa musik tradisional tidak hanya untuk hiburan, tetapi juga digunakan oleh masyarakat yang memegang teguh tradisi untuk berkomunikasi dengan Tuhan. Mereka berkomunikasi dengan Tuhan melalui musik dan nyanyian. Pendapat Tengku Ryo diatas dapat kita gunakan untuk membaca sejarah munculnya kesenian tradisional, seperti halnya Muaik Bambu yang kali ini kita jadikan sebagai topik pembahasan. Bambu bagi masyarakat Halmahera, tidak hanya berfungsi untuk menjadi bahan baku pembuatan rumah, pagar, tiang, dipan, rakit sungai, dan permainan bambu gila, tetapi juga dapat dimanfaatkan untuk sebagai alat musik. Kesenian dengan bambu sebagai peralatan utamanya oleh masyarakat Halmahera disebut dengan Musik Bambu  atau Hitadi.</p>"
  },{
    description : "<p>Sasando adalah sebuah alat instrumen petik musik. Instumen musik ini berasal dari pulau Rote, Nusa Tenggara Timur. Secara harfiah nama Sasando menurut asal katanya dalam bahasa Rote, sasandu, yang artinya alat yang bergetar atau berbunyi. Konon sasando digunakan di kalangan masyarakat Rote sejak abad ke-7. Bentuk sasando ada miripnya dengan instrumen petik lainnya seperti gitar, biola dan kecapi. Bagian utama sasando berbentuk tabung panjang yang biasa terbuat dari bambu. Lalu pada bagian tengah, melingkar dari atas ke bawah diberi ganjalan-ganjalan di mana senar-senar (dawai-dawai) yang direntangkan di tabung, dari atas kebawah bertumpu. Ganjalan-ganjalan ini memberikan nada yang berbeda-beda kepada setiap petikan senar. Lalu tabung sasando ini ditaruh dalam sebuah wadah yang terbuat dari semacam anyaman daun lontar yang dibuat seperti kipas. Wadah ini merupakan tempat resonansi sasando.</p>",
    howtoplay : "<p>Alat musik ini dimainkan dengan cara dipetik..</p>",
    image : "placeholder.jpg",
    imagecover: "sasando-cover.jpg",
    location : "nusa",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "sasando",
    story : "<p>Sejarah alat musik sasando menurut penuturan masyarakat di Pulau Rote diawali seorang pemuda bernama Sangguana. Suatu hari ia pergi menuju padang sabana, karena kelelahan kemudian ia berhenti untuk beristirahat sejenak di bawah pohon lontar. Secara tidak sengaja ia pun tertidur dan bermimpi sedang memainkan sebuah alat musik dari pohon lontar dan berikutnya mimpi tersebut menginspirasinya untuk menciptakan alat musik yang kemudian dikenal sebagai sasando.</p>"
  }, {
    description : "<p>rebana adalah adalah gendang berbentuk bundar dan pipih. ini merupakan symbol kota bumiayu .terbuat Bingkai berbentuk lingkaran dari kayu yang dibubut, dengan salah satu sisi untuk ditepuk berlapis kulit kambing..</p>",
    howtoplay : "<p>dengan cara dipukul.</p>",
    image : "placeholder.jpg",
    imagecover: "rebana-cover.jpg",
    location : "sumatera",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "rebana",
    story : "<p> Latar belakang sejarah Rebana Biang belum dapat diketahui secara pasti. Walau begitu, paling tidak terdapat dua keterangan yang berbeda mengenai asal-usul Rebana Biang menurut dua orang maestro kesenian tersebut. Seperti yang termuat dalam website resmi Lembaga Kebudayaan Betawi, menurut Sa’anam, Rebana Biang sampai di Betawi dibawa oleh pasukan Mataram pimpinan Sultan Agung. Ketika itu Rebana Biang berfungsi sebagai hiburan dan sarana melakukan kegiatan tarekat. Namun diperkirakan rebana biang sudah ada sebelum Agama Islam. Argumen ini belum sepenuhnya bisa diterima karena belum ada data yang cukup mendukung, namun jika Rebana Biang dipengaruhi budaya Arab terdengar cukup masuk akal. Adapun jika memang dikaitkan dengan kedatangan Sultan Agung, maka secara temporal Rebana Biang mungkin saja sudah masuk ke Betawi/Batavia sekitar 1628/1629. Artinya, Jika meneypakati argument Sa’anam, berarti Rebana Biang sudah berumur tua di Betawi. Keterangan lain dikemukakan oleh Abdurrachman, seorang seniman Rebana Biang, menurutnya Rebana Biang sampai di Betawi dibawa dari tanah Banten oleh seorang yang dipanggil Bapak kumis. Ia adalah seniman Rebana Biang yang memperkenalkannya di Ciganjur. Orang Ciganjur pertama yang belajar Rebana Biang kepada Bapak Kumis adalah H. Damong. Melalui H. Damong inilah kemudian kesenian Rebana Biang main populer, sehingga melahirkan generasi penerus seperti H. Ditong, H. Amsir, H. Abdullah, dan lain-lain. H. Sa’aba menjadi generasi ketiga yang meneruskannya kepada kegenerasi keempat, yaitu Abdurrachman, Engkos, H. Mursidi, dan lain-lain (lembagakebudayaanbetawi.com). Argumen ini terdengar lebih terperinci dengan menyebutkan nama penyebarnya serta generasi ke generasi yang meneruskan. Hanya saja, keterangan ini tentu bukan sumber primer, karena Abdurrachman bole hjadi memperoleh informasi ini pun secara turun-temurun pula. Artinya, ada rentang waktu yang cukup jauh untuk mengetahu secara pasti siapa penyebar Rebana Biang yang pertama. Versi lain mengemukakan, seperti dalam buku Seni Budaya Betawi (Dinas Kebudayaan Provinsi DKI Jakarta, Rebana menurut perkembangannya diciptakan oleh Pak Saiman dari aspirasinya ketika air hujan rintik-rintik diatap rumahnya yang bocor. Namun pernyataan tersebut tidak akurat. Tidak disinggung siapa itu Pak Saiman, dimana tempat tinggalnya dan sejak kapan memperkenalkan kepada khalayak dan kapan mulai dikembangkan.Pendapat lain menjelaskan, berasal dari daerah Sumatera Selatan, yang berfungsi untuk upacara-upacara, salah satunya Maulud dan lain-lain. Sebagai alat musik pengiring nyanyian yang mempergunakan prosa-prosa Arab tinggi (bukan ayat-ayat Al Quran) karena mulanya Rebana banyak digelar di Masjid-masjid, Surau dan di tengah komunitas Muslim. Walaupun musik Rebana lebih kencang ditindih puji-pujian yang memuliakan asma Allah dan menggunakan bahasa Arab, namun ada pula yang mengatakan Rebana bukan dari Timur Tengah</p>"
  },  {
    description : "<p>Saluang adalah alat musik tradisional khas Minangkabau, Sumatera Barat. Yang mana alat musik tiup ini terbuat dari bambu tipis atau talang (Schizostachyum brachycladum Kurz). Orang Minangkabau percaya bahwa bahan yang paling bagus untuk dibuat saluang berasal dari talang untuk jemuran kain atau talang yang ditemukan hanyut di sungai[1]. Alat ini termasuk dari golongan alat musik suling, tapi lebih sederhana pembuatannya, cukup dengan melubangi talang dengan empat lubang. Panjang saluang kira-kira 40-60 cm, dengan diameter 3-4 cm.</p>",
    howtoplay : "<p>Keutamaan para pemain saluang ini adalah dapat memainkan saluang dengan meniup dan menarik napas bersamaan, sehingga peniup saluang dapat memainkan alat musik itu dari awal dari akhir lagu tanpa putus. Cara pernapasan ini dikembangkan dengan latihan yang terus menerus. Teknik ini dinamakan juga sebagai teknik manyisiaha n angok (menyisihkan napas).</p>",
    image : "placeholder.jpg",
    imagecover: "saluang-cover.jpg",
    location : "sumatera",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "saluang",
    story : "<p>Orang Minangkabau memiliki tradisi seni pertunjukan yang termasuk paling kaya ragamnya di Indonesia. sakah satunya adalah saluang; bentuk kesenian yang tidak membawakan cerita sama sekali dan hanya terdiri dari lagu-lagu lepas. Cerita-cerita itu-yang sudah sering diketahui oleh pendengarnya-tidak disajikan sebagai hafalan, melainkan diceritakan secara spontan. Unsur spontanitas juga terdapat dalam syair-syair untuk lagu-lagu lepasnya. Pada umumnya suatu pertunjukan dimulai agak malam, kemungkinan setelah suatu pertunjukan pengantar-musik pop, atau tarian minang yang diringi talempong- dituntaskan. Pada tahap awal pertunjukan seperti pertunjukan saluang, Rabab Pariaman, suasana biasanya ringan, dan sering syair lagunya mengenai percintaan, yang kadang secara sugestif. Tetapi semakin jauh malam menjadi lebih bersuasana nostalgia, melankonis, dan sekaligus memilukan.Dengan jumlah pemain yang sangat terbatas, bentuk kesenian ini bersuara pelan dan bersifat akrab-cocok untuk tengah malam. Dari pendengarnya dituntut perhatian penuh, tetapi tidak selalu diperoleh: para penonton malah ngobrol, merokok, makan, main kartu dan domino; pada muda-mudi mencuri kesempatan bercumbu rayu. Kalau sudah sampai jam satu atau dua pagi, banyak penonton telah pulang, dan dari yang masih tinggal kebanyakan tertidur. Tetapi beberapa diantaranya masih bertahan duduk dekat dengan para pemain, menyimak syair-syairnya dengan tekun, sambil berdecak kagum pada suatu kalimat yang tepat, menuggu babak-babak cerita selanjutnya.</p>"
  },  {
    description : "<p>Serunai, atau juga disebut puput serunai, adalah nama alat musik tiup yang dikenal di Indonesia sebagai alat musik tradisional masyarakat Minang. Bagian unik dari serunai adalah ujungnya yang mengembang, berfungsi untuk memperbesar volume suara.Bahan untuk membuat sebuah puput serunai tradisional Minang terdiri dari batang padi, kayu atau bambu, tanduk kerbau atau daun kelapa. Bagian penata bunyi serunai terbuat dari kayu capo ringkik atau dari bambu talang yang ukurannya sebesar ibu jari tangan. Capo ringkik adalah sejenis tanaman perdu yang mempunyai lapisan kayu keras namun mempunyai bagian dalam yang lunak, sehingga mudah untuk dilubangi. Kayu yang panjangnya 20 cm tersebut diberi 4 lubang yang berselisih jarak 2,5 cm, yang berfungsi memberi beda tinggi rendah nada.Puput adalah bagian yang ditiup pada alat musik serunai, biasa terbuat dari kayu, bambu talang, atau batang padi tua. Bagian ini disambungkan oleh bagian penyambung yang berfungsi sebagai pangkal puput tersebut. Panjangnya sekitar 5 cm dan terbuat dari kayu keras. Penyambung ini dilubangi untuk saluran udara tiup, yang bersambungan dengan poros badan dan poros corong. Di bagian belakang, bagian penyambung ini juga berbentuk corong, dengan diameter 2 cm.Bagian corong adalah bagian ujung serunai yang dibentuk membesar seperti ujung akhir alat musik trompet. Fungsi bagian ini adalah untuk memperkeras atau memperbesar volume suara. Bagian ini biasanya terbuat dari kayu, terutama kayu gabus, dari tanduk kerbau yang secara alamiah telah berbentuk lancip mengembang, ataupun dari daun kelapa yang dililitkan. Panjangnya sekitar 10 sampai 12 cm, dengan garis tengah 6 cm di bagian yang mengembang.</p>",
    howtoplay : "<p>ditiup</p>",
    image : "placeholder.jpg",
    imagecover: "serunai-cover.jpg",
    location : "sumatera",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "serunai",
    story : "<p>Asal mula serunai atau puput serunai diperkirakan datang dari nama shehnai, alat musik yang berasal dari Lembah Kashmir di dataran India Utara.[1] Alat musik shehnai diduga merupakan perkembangan dari alat musik pungi yang dipakai dalam musik para pemikat ular tradisional India.Setelah dikenal luas di dataran tinggi Minangkabau (kawasan Sumatera Barat sekarang), serunai menjadi populer sebagai alat musik tiup tradisional Minang. Alat musik ini dikenal merata di Sumatera Barat, terutama di bagian dataran tinggi seperti di daerah Agam, Tanah Datar dan Lima Puluh Kota, dan juga di sepanjang pesisir pantai Sumatera Barat. Alat musik ini sejak lama telah dipopulerkan ke seluruh Indonesia oleh para imigran dari Minang dan juga telah dikenal sebagai alat musik tradisional di Malaysia dan masyarakat Banjar di Kalimantan dengan nama yang sama.</p>"
  },  {
    description : "<p>Talempong adalah sebuah alat musik pukul tradisional khas suku Minangkabau. Bentuknya hampir sama dengan instrumen bonang dalam perangkat gamelan. Talempong dapat terbuat dari kuningan, namun ada pula yang terbuat dari kayu dan batu. Saat ini talempong dari jenis kuningan lebih banyak digunakan. Talempong berbentuk lingkaran dengan diameter 15 sampai 17,5 sentimeter, pada bagian bawahnya berlubang sedangkan pada bagian atasnya terdapat bundaran yang menonjol berdiameter lima sentimeter sebagai tempat untuk dipukul. Talempong memiliki nada yang berbeda-beda. Bunyinya dihasilkan dari sepasang kayu yang dipukulkan pada permukaannya.</p>",
    howtoplay : "<p>Dipukul</p>",
    image : "placeholder.jpg",
    imagecover: "talempong-cover.jpg",
    location : "sumatera",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "talempong",
    story : "<p>Keberadaan musik talempong tersebut merupakan salah satu bagaian dari kesatuan sistem budaya masyarakat Minangkabau. Hal demikian dapat dilihat dalam upacara batagak gadang --adat perhelatan pimpinan suku. Arti penting keberadaan musik talempong itu dalam sistem kebudayaan masyarakat Minangkabau tercermin dalam ungkapan pepatah adatnya; kalau alam alah takambang, marawa tampak takiba, batingkah aguang jo talempong,  tandonyo adaik badiri di nagari, pupuik jo saluang kabungonyo, silek jo tari kagunjainyo (kalau alam sudah terkembang, marawa (bendera kebesaran adat) tampak berkibar, bertingkah gong jo talempong, tandanya adat berdiri di nagari, puput jo saluang kebunganya, silek jo tari kegunjainya. Menurut Bahar, gong dan talempong, sejajar dengan ’kekuasaan’ datuak (datuk) sebagai pimpinan tertinggi dalam kehidupan masyarakat Minangkabau (Bahar. 2009: 7). Sejajar dalam pengertian yang dimaksud Bahar adalah bahwa musik talempong itu mempunyai peran signifikan dalam uacara pengangatan penghulu; seperti dimaksud dalam ungkapan adatnya.</p>"
  }, {
    description : "<p>Tifa mirip dengan alat musik gendang yang dimainkan dengan cara dipukul. Alat musik ini terbuat dari sebatang kayu yang dikosongi atau dihilangi isinya dan pada salah satu sisi ujungnya ditutupi, dan biasanya penutupnya digunakan kulit rusa yang telah dikeringkan untuk menghasilkan suara yang bagus dan indah. Bentuknyapun biasanya dibuat dengan ukiran. Setiap suku di Maluku dan Papua memiliki tifa dengan ciri khas nya masing-masing.</p>",
    howtoplay : "<p>dengan cara dipukul.</p>",
    image : "placeholder.jpg",
    location : "papua",
    imagecover: "tifa-cover.jpg",
    melody : [ "da", "mi", "na", "ti", "la", "da2" ],
    name : "tifa",
    story : "<p> Konon di suatu tempat di Biak ada dua orang laki-laki bersaudara yang bernama Fraimun dan Sarenbeyar, masing-masing memiliki arti yaitu saren : busur dan beyar : tali busur, jadi sarenbeyar berarti saren / busur yang telah terpasang anak panahnya, fraimun artinya perangkat perang yang gagangnya dapat membunuh (karena dia pernah membunuh). Kedua kakak beradik ini pergi dari daerah tempat tinggal mereka yang bernama Maryendi dan berpetualang hingga sampai di daerah Biak Utara yang disebut Wampamber, karena mereka melihat bahwa kampung mereka Maryendi ini telah tenggelam. Keduanya lalu tinggal menetap di  Wampamber, hingga suatu malam mereka berdua pergi berburu ke dalam hutan dan mendengar suara yang ternyata berasal dari sebuah pohon yang disebut pohon opsur, yang artinya pohon atau kayu yang mengeluarkan suara. Mereka lalu pulang ke rumah malam itu dan keesokan paginya kembali ke tempat yang sama di dalam hutan hendak melihat lagi pohon opsur tersebut. Ternyata pada pohon opsur itu terdapat juga lebah madu hutan dan sarangnya serta soa-soa / biawak (lizard) yang hidup disitu. Keduanya lalu menebang pohon itu dan membuat batang kayu seukuran  ± 50 cm panjangnya. Rupanya mereka berdua memiliki keahlian khusus untuk mengerjakan kayu yang ditebang itu menjadi sebuah benda yang disebut tifa (alat musik pukul atau ditabuh). Keduanya tidak memiliki peralatan yang cukup lengkap, hanya peralatan sederhana seperti nibong (sebatang besi panjang ± 1 m, bagian ujungnya tajam) untuk mengeruk atau menggali bagian tengah dari batang kayu tersebut sehingga terbentuk lubang sepanjang kayu itu membentuk seperti pipa. Selain dikeruk dengan nibong, proses pelubangan dilakukan selang-seling sambil membakar bagian tengahnya untuk hasil yang lebih bagus. Setelah itu mereka hendak menutup satu sisi permukaan lubang (bagian atasnya) dengan sesuatu. Setelah berpikir maka sang adik kemudian mendapat akal dan menyuruh kakaknya untuk menguliti sebagian kulit pahanya sebagai penutup lubang kayu seperti yang mereka maksudkan. Sang kakak berkata kepada adiknya kalau hal itu dilakukan akan sangat menyakitkan dirinya. Kakaknya menyarankan agar memakai kulit hewan saja, yaitu kulit dari soa-soa (sebutan di Papua) atau biawak yang pernah mereka lihat hidup di pohon opsur itu. Tapi untuk menangkap soa-soa tersebut mereka harus menggunakan cara khusus, yaitu dengan memanggil hewan itu menggunakan bahasa mereka (Bahasa Biak), bunyinya ; “ Hei, napiri bo, ………” dan seterusnya, lalu soa-soa tersebut mengangkat kepalanya pertanda dia mengerti akan maksud kedua bersaudara ini yang hendak mengambil kulitnya, dia pun merelakan dirinya dibawa, maka Fraimun & Sarenbeyar pun mengikatnya dengan tali dan membawanya pulang. Mereka lalu menguliti soa-soa  tersebut dan memakai kulitnya untuk menutup salah satu permukaan kayu yang telah dilubangi itu, sehingga bagian yang ditutup dengan kulit adalah bagian atasnya. Maka jadilah alat musik tabuh / pukul yang dikenal sebagai tifa.</p>"
  } 

  ];
    self.find = function(name) {
        return _.findWhere(self.instruments, {name : name});
    }
    return self;
})

.factory('Flickr', function($resource, $q) {
  var photosPublic = $resource('http://api.flickr.com/services/feeds/photos_public.gne', 
      { format: 'json', jsoncallback: 'JSON_CALLBACK' }, 
      { 'load': { 'method': 'JSONP' } });
      
  return {
    search: function(query) {
      var q = $q.defer();
      photosPublic.load({
        tags: query
      }, function(resp) {
        q.resolve(resp);
      }, function(err) {
        q.reject(err);
      })
      
      return q.promise;
    }
  }
})

.controller('FlickrCtrl', function($scope, Flickr) {

  var doSearch = ionic.debounce(function(query) {
    Flickr.search(query).then(function(resp) {
      $scope.photos = resp;
    });
  }, 500);
  
  $scope.search = function() {
    doSearch($scope.query);
  }

})

.directive('pushSearch', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var amt, st, header;

      $element.bind('scroll', function(e) {
        if(!header) {
          header = document.getElementById('search-bar');
        }
        st = e.detail.scrollTop;
        if(st < 0) {
          header.style.webkitTransform = 'translate3d(0, 0px, 0)';
        } else {
          header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
        }
      });
    }
  }
})

.directive('photo', function($window) {
  return {
    restrict: 'C',
    link: function($scope, $element, $attr) {
      var size = ($window.outerWidth / 3) - 2;
      $element.css('width', size + 'px');
    }
  }
});