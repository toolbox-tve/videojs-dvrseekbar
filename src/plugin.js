'use strict';
/**
 * @file plugin.js
 * @module dvrseekbarPlugin
 */
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
 * @function dvrseekbarPlugin
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const dvrseekbarPlugin = function(options) {

  // If explicity set options to false disable plugin:
  if (typeof(options) === 'boolean' && options === false ) {
    return;
  }

  if (!options || options === {}) {
    options = defaults;
  }


  this.one('durationchange', (e) => {
    const IS_LIVE_STREAM = this.duration() > 1e+300;
    //
    if (IS_LIVE_STREAM) {
      this.controlBar.removeChild('progressControl');
      this.controlBar.removeChild('timeDivider');
      this.controlBar.removeChild('durationDisplay');

      this.controlBar.liveDisplay.addChild('DVRseekBar');
    } else {
      if(this.controlBar.liveDisplay.getChild('DVRseekBar') !== undefined) {
        this.controlBar.liveDisplay.removeChild('DVRseekBar');

        this.controlBar.addChild('timeDivider');
        this.controlBar.addChild('durationDisplay');
        this.controlBar.addChild('progressControl');
      }
    }
  });
};

// Include the version number.
dvrseekbarPlugin.VERSION = '__VERSION__';

// Register the plugin with video.js.
// Updated for video.js 6 - https://github.com/videojs/video.js/wiki/Video.js-6-Migration-Guide
const registerPlugin = videojs.registerPlugin || videojs.plugin;

registerPlugin('dvrseekbar', dvrseekbarPlugin);
export default dvrseekbarPlugin;
////////////////////////////////
