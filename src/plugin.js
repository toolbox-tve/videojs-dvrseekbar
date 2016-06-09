import videojs from 'video.js';
// Default options for the plugin.
const defaults = {
  startTime: 0
};

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
    newLink = document.createElement('button');

  btnLiveEl.className = 'vjs-live-button vjs-control';

  newLink.innerHTML = document.getElementsByClassName('vjs-live-display')[0].innerHTML;
  newLink.id = 'liveButton';

  if (!player.paused()) {
    newLink.className = 'vjs-live-label onair';
  }


  let clickHandler = function(e) {
    player.currentTime(player.seekable().end(0));

    player.play();
  };

  if (newLink.addEventListener) { // DOM method
    newLink.addEventListener('click', clickHandler, false);
  } else if (newLink.attachEvent) { // this is for IE, because it doesn't support addEventListener
    newLink.attachEvent('onclick', function() { return clickHandler.apply(newLink, [ window.event ]); });
  }

  btnLiveEl.appendChild(newLink);

  let controlBar = document.getElementsByClassName('vjs-control-bar')[0],
  insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];

  controlBar.insertBefore(btnLiveEl, insertBeforeNode);

  videojs.log('dvrSeekbar Plugin ENABLED!', options);
};

const onTimeUpdate = (player, e) => {
  let time = player.seekable();
  let btnLiveEl = document.getElementById('liveButton');

  if (!time.length) {
    return;
  }

  /*let time1 = time && time.length ? time.end(0) - time.start(0) : 0;

  if(time1 > 0) {
    player.duration(time1 + 2);
  }
*/

  if (time.end(0) - player.currentTime() < 30) {

      btnLiveEl.className = 'vjs-live-label onair';
  } else {
      btnLiveEl.className = 'vjs-live-label';
  }

  player.duration(player.seekable().end(0));
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
  const player = this;
  const SeekBar = videojs.getComponent('SeekBar');

  SeekBar.prototype.dvrTotalTime = function(player) {
    let time = player.seekable();

    return  time && time.length ? time.end(0) - time.start(0) : 0;
  };

  SeekBar.prototype.handleMouseMove = function (e) {
    let bufferedTime, newTime;

    bufferedTime = newTime = this.player_.seekable();

    if (bufferedTime && bufferedTime.length) {
      for (newTime = bufferedTime.start(0) + this.calculateDistance(e) * this.dvrTotalTime(this.player_); newTime >= bufferedTime.end(0);)
        newTime -= .1;

      this.player_.currentTime(newTime);
    }
  };

  SeekBar.prototype.updateAriaAttributes = function () {
      let a, c, d = this.player_.seekable();

      d && d.length && (a = this.player_.scrubbing ? this.player_.getCache().currentTime : this.player_.currentTime(),
      c = d.end(0) - a, c = 0 > c ? 0 : c,
      this.el_.setAttribute('aria-valuenow',
        Math.round(100 * this.getPercent(), 2)),
      this.el_.setAttribute('aria-valuetext',
        (0 === a ? "" : "-") + videojs.formatTime(c, d.end(0))));
  };

  if (!options) {
    options = defaults;
  }

  this.on('timeupdate', (e) => {
    onTimeUpdate(this, e);
  });


  this.on('play', (e) => {});


  this.on('pause', (e) => {
    let btnLiveEl = document.getElementById('liveButton');

    btnLiveEl.className = 'vjs-live-label';
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
