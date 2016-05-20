import videojs from 'video.js';
const Seekbar = videojs.getComponent('Seekbar');

class DVRSeekBar extends Seekbar {

   constructor: function (player, options) {
        startTime = options.startTime;
        VjsSeekBar.call(this, player, options);
    }
}
