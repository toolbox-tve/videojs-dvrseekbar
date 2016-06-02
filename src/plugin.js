import videojs from 'video.js';
// Default options for the plugin.
const defaults = {
  startTime: 0
};
const SeekBar = videojs.getComponent('SeekBar');

/**
 * SeekBar with DVR support class
 */
class DVRSeekBar extends SeekBar {

  /** @constructor */
  constructor(player, options) {

    super(player, options);
    this.startTime = options.startTime;
  }

  handleMouseMove(e) {
   let bufferedTime, newTime;

    if (this.player_.duration() < this.player_.currentTime()) {
        this.player_.duration(this.player_.currentTime());
        bufferedTime = this.player_.currentTime() - this.options.startTime;
        newTime = (this.player_.currentTime() - bufferedTime) + (this.calculateDistance(e) * bufferedTime); // only search in buffer

    } else {
        bufferedTime = this.player_.duration() - this.options.startTime;
        newTime = (this.player_.duration() - bufferedTime) + (this.calculateDistance(e) * bufferedTime); // only search in buffer

    }
    if (newTime < this.options.startTime) { // if calculated time was not played once.
        newTime = this.options.startTime;
    }
    // Don't let video end while scrubbing.
    if (newTime == this.player_.duration()) {
        newTime = newTime - 0.1;
    }

    // Set new time (tell player to seek to new time)
    this.player_.currentTime(newTime);
  }

}

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-dvrseekbar');
  player.controlBar.addClass('vjs-dvrseekbar-control-bar');

  if (player.controlBar.progressControl) {
    player.controlBar.progressControl.addClass('vjs-dvrseekbar-progress-control');
  }

  // ADD Live Button:
  let btnLiveEl = document.createElement('div'),
    newLink = document.createElement('a');

  btnLiveEl.id = 'liveButton';
  btnLiveEl.className = 'vjs-live-button vjs-control';
  btnLiveEl.innerHTML = document.getElementsByClassName('vjs-live-display')[0].innerHTML;
  btnLiveEl.appendChild(newLink);

  let controlBar = document.getElementsByClassName('vjs-control-bar')[0],
  insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];

  controlBar.insertBefore(btnLiveEl, insertBeforeNode);

  videojs.log('dvrSeekbar Plugin ENABLED!', options);
};

const onTimeUpdate = (player, e) => {

  player.duration(player.currentTime());
};


/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function dvrseekbar
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const dvrseekbar = function(options) {
  const player  = this;

  if (!options) {
    options = defaults;
  }

  let dvrSeekBar = new DVRSeekBar(player, options);

  //Register custom DVRSeekBar Component:
  videojs.registerComponent('DVRSeekBar', DVRSeekBar);

  this.on('timeupdate', (e) => {
    onTimeUpdate(this, e);
  });

  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('dvrseekbar', dvrseekbar);

// Include the version number.
dvrseekbar.VERSION = '__VERSION__';

export default dvrseekbar;
