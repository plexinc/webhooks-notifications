var express = require('express')
  , request = require('request')
  , multer  = require('multer');

const NotificationCenter = require('node-notifier').NotificationCenter;
var upload = multer({ dest: '/tmp/' });
var app = express();
var notifier = new NotificationCenter();
var mediakeys = require('mediakeys').listen();
var isPlaying = true;

app.post('/', upload.single('thumb'), function (req, res, next) {
  var payload = JSON.parse(req.body.payload);
  console.log('Got webhook for', payload.event);

  // If the right player is playing a track, display a notification.
  if (payload.Player.uuid = process.env.PLAYER && payload.event == "media.play" && payload.Metadata.type == "track") {
    notifier.notify({
      title: payload.Metadata.grandparentTitle,
      subtitle: payload.Metadata.parentTitle,
      message: payload.Metadata.title,
      sender: 'com.plexapp.plexmediaserver',
      contentImage: req.file ? req.file.path : '',
    });
  }

  if (payload.event == "media.play" || payload.event == "media.resume") {
    isPlaying = true;
  } else if (payload.event == "media.pause" || payload.event == "media.stop") {
    isPlaying = false;
  }

  res.sendStatus(200);
});

var options = {
  headers: {
    'X-Plex-Token': process.env.TOKEN,
    'X-Plex-Target-Client-Identifier': process.env.PLAYER
  }
};

// Use the plex.tv endpoints to control the player. N.B. that this only
// works with players which support the newer PubSub playback control.
//
mediakeys.on('play', function () {
  console.log('Media key: play/pause, sending ' + (isPlaying ? 'pause' : 'play'));
  options.url = 'https://plex.tv/player/playback/' + (isPlaying ? 'pause' : 'play');
  request(options);
})
mediakeys.on('next', function () {
  console.log('Media key: next');
  options.url = 'https://plex.tv/player/playback/skipNext';
  request(options);
})
mediakeys.on('back', function () {
  console.log('Media key: back');
  options.url = 'https://plex.tv/player/playback/skipPrevious';
  request(options);
})

app.listen(10000);
