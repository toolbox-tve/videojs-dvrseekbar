import videojs from 'video.js';
import { version as VERSION } from '../package.json';

import { getSeekRange, isLive } from './utils';

import './components/LiveButton/liveButton';
import './components/DvrProgressControl/DvrProgressControl';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  startTime: 'LIVE',
  // Minimun time in dvr to show the seekbar
  dvrMinTime: 840
};

const SeekBar = videojs.getComponent('SeekBar');

SeekBar.prototype.dvrTotalTime = function(player) {
  let time = player.seekable();

  return time && time.length ? time.end(0) - time.start(0) : 0;
};

SeekBar.prototype.handleMouseMove = function(e) {
  let bufferedTime;
  let newTime;

  bufferedTime = newTime = this.player_.seekable();

  if (bufferedTime && bufferedTime.length) {
    let progress = this.calculateDistance(e) * this.dvrTotalTime(this.player_);

    newTime = bufferedTime.start(0) + progress;
    for (; newTime >= bufferedTime.end(0);) {
      newTime -= 0.1;
    }

    this.player_.currentTime(newTime);
  }
};

SeekBar.prototype.updateAriaAttributes = function() {
  const seekableRanges = this.player_.seekable() || [];

  if (seekableRanges.length) {
    const lastSeekableTime = seekableRanges.end(0);
    const cachedCTime = this.player_.getCache().currentTime;
    const currentTime = this.player_.scrubbing ? cachedCTime : this.player_.currentTime();
    let timeToLastSeekable;

    // Get difference between last seekable moment and current time
    timeToLastSeekable = lastSeekableTime - currentTime;
    if (timeToLastSeekable < 0) {
      timeToLastSeekable = 0;
    }

    // Update current time control
    const formattedTime = videojs.formatTime(timeToLastSeekable, lastSeekableTime);
    const formattedPercentage = Math.round(100 * this.getPercent(), 2);

    this.el_.setAttribute('aria-valuenow', formattedPercentage);
    this.el_.setAttribute('aria-valuetext', (currentTime ? '' : '-') + formattedTime);
  }
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class Dvrseekbar extends Plugin {
  /**
   * Create a Dvrseekbar plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.tech = null;

    // Shaka Player instance
    // More on https://shaka-player-demo.appspot.com/docs/api/shaka.Player.html
    this.shakaPlayer = null;

    this.seekbar = null;
    this.liveButton = null;

    this.player.ready(() => {
      this.player.addClass('vjs-dvrseekbar');
    });

    // Tries to load the tech in "loadedmetadata" event
    this.player.on('loadedmetadata', this.techLoaded.bind(this));
    this.player.on('loadeddata', this.init.bind(this));
  }

  techLoaded() {
    this.tech = this.player.tech_;
    // Assumes shakaPlayer is in player.tech TODO: make it configurable
    this.shakaPlayer = this.tech && this.tech.shakaPlayer;
  }

  /**
   * Creates dvr seekbar
   *
   * @memberof Dvrseekbar
   */
  init() {
    const controlBar = this.player.controlBar;
    const dvrSeekBar = controlBar && controlBar.dvrProgressControl && controlBar.dvrProgressControl.DvrSeekBar;
    const playProgressBar = dvrSeekBar && dvrSeekBar.playProgressBar;

    if (isLive(this.player)) {
      controlBar.liveButton.show();

      if (this.isDVR()) {
        controlBar.dvrProgressControl.show();
        playProgressBar.removeChild('TimeTooltip');
        this.player.currentTime(this.getCurrentLiveTime(this.options.startTime));
      } else {
        controlBar.dvrProgressControl.hide();
        controlBar.durationDisplay.hide()
        controlBar.timeDivider.hide()
        controlBar.currentTimeDisplay.hide()
      }
    } else {
      controlBar.liveButton.hide();
      controlBar.dvrProgressControl.show();

      if (!playProgressBar.getChild('TimeTooltip')) {
        playProgressBar.addChild('TimeTooltip');
      }
    }
  }

  isDVR() {
    const chromecastSessionManager = this.player.tech_ && this.player.tech_._chromecastSessionManager;
    const liveSeekableRange = chromecastSessionManager && chromecastSessionManager.remotePlayer
      && chromecastSessionManager.remotePlayer.liveSeekableRange;

    if (liveSeekableRange) {
      return (liveSeekableRange.end - liveSeekableRange.start) > this.options.dvrMinTime;
    } else if (this.dash && this.dash.mediaPlayer){
      return this.dash.mediaPlayer.getDVRWindowSize() > this.options.dvrMinTime;
    } else if (this.shakaPlayer) {
      return (this.shakaPlayer.seekRange().end - this.shakaPlayer.seekRange().start) > this.options.dvrMinTime;
    } else if (this.player.tech_['seekable'] && this.player.seekable().length > 0) {
      return (this.player.seekable().end(0) - this.player.seekable().start(0)) > this.options.dvrMinTime;
    }
    return false;
  }

  getCurrentLiveTime(startTime) {
    const seekRange = getSeekRange(this.player);

    if (startTime === 'LIVE') {
      return seekRange.end;
    }
    return seekRange.start;
  }
}

// Define default values for the plugin's `state` object here.
Dvrseekbar.defaultState = {};

// Include the version number.
Dvrseekbar.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('dvrseekbar', Dvrseekbar);

export default Dvrseekbar;
