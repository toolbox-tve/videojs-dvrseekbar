import videojs from 'video.js';
import window from 'global/window';
import document from 'global/document';
import { version as VERSION } from '../package.json';
import DVRseekBar from './seekbar';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  startTime: 0,
  externalSeekable: null
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

    this.player.ready(() => {
      this.player.addClass('vjs-dvrseekbar');
    });

    this.player.on('loadeddata', () => {
      if (this.dash && this.dash.shakaPlayer) {
        this.ifShakaPlayer();
      } else {
        this.on('timeupdate', e => {
          this.onTimeUpdate(this, e);
        });

        this.on('pause', e => {
          const btnLiveEl = document.getElementById('liveButton');

          btnLiveEl.className = 'vjs-live-label';
        });

        this.otherSourceHandlers();
      }
    });

    this.one('playing', e => {
      const sourceHandler = this.tech_.sourceHandler_;

      if (options.flowMode) {
        let startTime = 0;

        if (sourceHandler.constructor.name === 'ShakaHandler') {
          startTime = sourceHandler.shakaPlayer.seekRange().start + 30;
        }

        this.currentTime(startTime);
      }
    });
  }

  /**
   * Called when videojs fires timeupdate event
   *
   * @param {*} player videojs instance
   * @param {*} e event
   * @memberof Dvrseekbar
   */
  onTimeUpdate(player, e) {
    const time =
      (player.seekableFromShaka && player.seekableFromShaka()) ||
      player.seekable();
    const btnLiveEl = document.getElementById('liveButton');

    // When any tech is disposed videojs will trigger a 'timeupdate' event
    // when calling stopTrackingCurrentTime(). If the tech does not have
    // a seekable() method, time will be undefined
    if (!time || !time.length) {
      return;
    }

    if (time.end(0) - player.currentTime() < 30) {
      btnLiveEl.className = 'label onair';
    } else {
      btnLiveEl.className = 'label';
    }

    player.duration(time.end(0));
  }

  /**
   * Function to call if the source handler is ShakaPlayer
   *
   * @memberof Dvrseekbar
   */
  ifShakaPlayer() {
    const dvrCurrentTime = document.createElement('div');

    dvrCurrentTime.setAttribute('id', 'dvr-current-time');
    dvrCurrentTime.innerHTML = '0:00';
    dvrCurrentTime.className = 'vjs-current-time-display';

    this.player.controlBar.progressControl.seekBar.hide();
    this.player.controlBar.progressControl.disable();

    const currentSrc = this.player.tech_ && this.player.tech_.currentSource_ || {};

    if (currentSrc.hasCatchUp) {
      this.player.controlBar.el_.insertBefore(
        dvrCurrentTime,
        this.player.controlBar.progressControl.el_.nextSibling
      );

      const dvrSeekBar = new DVRseekBar(this.player, this.options);

      this.player.controlBar.progressControl.el_.appendChild(
        dvrSeekBar.getEl()
      );
    }
  }

  /**
   * Function to call for others source handlers
   *
   * @memberof Dvrseekbar
   */
  otherSourceHandlers() {
    this.player.addClass('vjs-dvrseekbar');
    this.player.controlBar.addClass('vjs-dvrseekbar-control-bar');

    if (this.player.controlBar.progressControl) {
      this.player.controlBar.progressControl.addClass(
        'vjs-dvrseekbar-progress-control'
      );
    }

    // ADD Live Button:
    const btnLiveEl = document.createElement('div');
    const newLink = document.createElement('a');

    btnLiveEl.className = 'vjs-live-button vjs-control';

    newLink.innerHTML = document.getElementsByClassName(
      'vjs-live-display'
    )[0].innerHTML;
    newLink.id = 'liveButton';

    if (!this.player.paused()) {
      newLink.className = 'vjs-live-label onair';
    }

    const clickHandler = function(e) {
      const livePosition =
        (this.player.seekableFromShaka && this.player.seekableFromShaka().end()) ||
        this.player.seekable().end(0);

      this.player.currentTime(livePosition - 1);
      this.player.play();
      e.target.className += ' onair';
    };

    if (newLink.addEventListener) {
      // DOM method
      newLink.addEventListener('click', clickHandler, false);
    } else if (newLink.attachEvent) {
      // this is for IE, because it doesn't support addEventListener
      newLink.attachEvent('onclick', function() {
        return clickHandler.apply(newLink, [window.event]);
      });
    }

    btnLiveEl.appendChild(newLink);

    const controlBar = document.getElementsByClassName('vjs-control-bar')[0];
    const insertBeforeNode = document.getElementsByClassName(
      'vjs-progress-control'
    )[0];

    controlBar.insertBefore(btnLiveEl, insertBeforeNode);

    videojs.log('dvrSeekbar Plugin ENABLED!', this.options);
  }
}

// Define default values for the plugin's `state` object here.
Dvrseekbar.defaultState = {};

// Include the version number.
Dvrseekbar.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('dvrseekbar', Dvrseekbar);

export default Dvrseekbar;
