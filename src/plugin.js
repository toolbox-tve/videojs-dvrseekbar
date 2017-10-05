import videojs from 'video.js';
import DVRseekBar from './DVRSeekBar';
// Default options for the plugin.
const defaults = {
  startTime: 0,
  disableDVRslider: true
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

  // If explicity set options to false disable plugin:
  if (typeof(options) === 'boolean' && options === false ) {
    return;
  }

  if (!options || options === {}) {
    options = defaults;
  }


  this.one('durationchange', (e) => {
    const IS_LIVE_STREAM = this.duration() > 1e+300;

    if (IS_LIVE_STREAM) {
      //let dvrSeekBar = new DVRseekBar();

      this.controlBar.removeChild('progressControl');
      this.controlBar.removeChild('timeDivider');
      this.controlBar.removeChild('durationDisplay');
/*
      this.addClass('vjs-dvrseekbar');
      this.controlBar.addClass('vjs-dvrseekbar-control-bar');
      this.controlBar.progressControl.addClass('vjs-dvrseekbar-progress-control');*/

      this.controlBar.liveDisplay.addChild('DVRseekBar');

    } else {
      if(this.controlBar.progressControl.getChild('DVRseekBar') !== undefined) {
        this.controlBar.progressControl.removeChild('DVRseekBar');
        this.controlBar.addChild('timeDivider');
        this.controlBar.addChild('durationDisplay');
        this.controlBar.progressControl.addChild('seekBar');
      }
    }
  });

  this.ready(() => {

    /*let dvrSeekBar = new DVRseekBar({
      player: this
    });

    this.controlBar.progressControl.el_.appendChild(dvrSeekBar.getEl());*/
  });
};

// Register the plugin with video.js.
// Updated for video.js 6 - https://github.com/videojs/video.js/wiki/Video.js-6-Migration-Guide
var registerPlugin = videojs.registerPlugin || videojs.plugin;

registerPlugin('dvrseekbar', dvrseekbar);

// Include the version number.
dvrseekbar.VERSION = '__VERSION__';

export default dvrseekbar;
//////////////////////////
