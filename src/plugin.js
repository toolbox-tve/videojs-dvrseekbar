import videojs from 'video.js';
import debug from './utils/debug.js';

import DVRSeekbar from './components/dvrSeekBar.js';
import LiveButton from './components/liveButton.js';
import LivePlayerMixin from './mixins/livePlayer.js';

// Default options for the plugin.
let options = {
  debug: false,
  // Set to 60 seconds (each fragment usually lasts 10 seconds and most techs start at N - 3)
  onAirTolerance: 60,
  onAirClassName: 'vjs-dvrseekbar-onair'
};

const ON_AIR = 'ON_AIR';
const OFF_AIR = 'OFF_AIR';

let currentState = ON_AIR;
let streamWindowDuration;

/**
 * Function to invoke when the player is ready.
 * Adds plugin classes to player.
 *
 * @function onReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onReady = (player, options) => {
  debug('Player is ready, enable plugin and add CSS classes');

  player.addClass('vjs-dvrseekbar');

  // Force .vjs-live class on player.
  // If content is live but has no infinity duration, video.js sets no live flag
  player.addClass('vjs-live');
};

/**
 * On time update update player classes and set current state.
 *
 * @param  {Player} player
 * @param  {Object} e
 */
const onTimeUpdate = (player, e) => {
  const onAir = isStreamingOnAir(player);

  if (onAir) {
    player.addClass(options.onAirClassName);

    if (currentState !== ON_AIR) {
      debug('Streaming now ON AIR');
    }
  } else {
    player.removeClass(options.onAirClassName);

    if (currentState !== OFF_AIR) {
      debug('Streaming now OFF AIR');
    }
  }

  currentState = onAir ? ON_AIR : OFF_AIR;
};

/**
 * Returns true if it's considered that player is streaming on air now.
 *
 * @param  {Player} player
 * @return {Boolean}
 */
const isStreamingOnAir = (player) => {
  const lastSeekableTime = getLastSeekableTime(player);

  if (lastSeekableTime === null) {
    // If no time ranges yet, assume yes until there's more info available
    return true;
  }

  const difference = lastSeekableTime - player.currentTime();
  const onAir = (lastSeekableTime - player.currentTime()) < options.onAirTolerance;

  debug('isStreamingOnAir: lastSeekableTime=' + lastSeekableTime,
    ', currentTime=' + player.currentTime(),
    ', difference=' + difference,
    ', onAir=' + (onAir ? 'TRUE' : 'FALSE'));

  return onAir;
}

const getLastSeekableTime = function(player) {
  // The stream window duration can be accessed
  // via the seekable TimeRanges property
  const time = player.seekable();

  // When any tech is disposed videojs will trigger a 'timeupdate' event
  // when calling stopTrackingCurrentTime(). If the tech does not have
  // a seekable() method, time will be undefined
  if (!time || !time.length) {
    debug('isStreamingOnAir: no time ranges yet');
    return null;
  }

  // TODO: check if it'd be better to return time difference (now - started)
  // instead of last buffered time
  return time.end(0);
}

const onLoadedMetadata = function(player, e) {
  // Once metadata is loaded, get stream window length
  streamWindowDuration = getLastSeekableTime(player);
  player.duration(streamWindowDuration);

  const showSeconds = Math.round(streamWindowDuration);
  debug('Set stream window duration to ' + showSeconds + ' seconds (~' + parseInt(showSeconds / 60) + ' minutes)');
}

const playOnAir = function() {
  if (isStreamingOnAir(this)) {
    // If it's already streaming on air do nothing
    return;
  }

  lastSeekableTime = getLastSeekableTime(this);
  player.currentTime(lastSeekableTime);

  debug('Now playing ON AIR', 'currentTime=' + lastSeekableTime);
}

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
const dvrseekbar = function(options_) {
  const player = this;

  if (options_) {
    options = videojs.mergeOptions(options, options_);
  }

  debug.enable(options.debug);

  // TODO: desacoplar de player
  player.playOnAir = playOnAir.bind(player);

  player.on('timeupdate', (e) => {
    onTimeUpdate(this, e);
  });

  player.on('loadedmetadata', (e) => {
    onLoadedMetadata(this, e);
  });

  player.ready(() => {
    onReady(this, options);
  });

  player.on('play', (e) => {
  });

  player.on('pause', (e) => {
  });
};

// Controlable desde player
/*
const ControlBar = videojs.getComponent('ControlBar');
ControlBar.prototype.options_.children = [
  'playToggle',
  'volumeMenuButton',
  'liveDisplay',
  'currentTimeDisplay',
  'timeDivider',
  'durationDisplay',
  'progressControl',
  'remainingTimeDisplay',
  'customControlSpacer',
  'playbackRateMenuButton',
  'chaptersButton',
  'descriptionsButton',
  'subtitlesButton',
  'captionsButton',
  'audioTrackButton',
  'fullscreenToggle'
];
*/

// Register the plugin with video.js.
videojs.plugin('dvrseekbar', dvrseekbar);

// Include the version number.
dvrseekbar.VERSION = '__VERSION__';

export default dvrseekbar;
