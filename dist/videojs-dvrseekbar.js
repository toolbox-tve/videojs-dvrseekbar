/**
 * videojs-dvrseekbar
 * @version 0.2.6
 * @copyright 2017 ToolBox-tve
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsDvrseekbar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

// Default options for the plugin.
var defaults = {
  startTime: 0
};

var SeekBar = _videoJs2['default'].getComponent('SeekBar');

SeekBar.prototype.dvrTotalTime = function (player) {
  var time = player.seekable();

  return time && time.length ? time.end(0) - time.start(0) : 0;
};

SeekBar.prototype.handleMouseMove = function (e) {
  var bufferedTime = undefined;
  var newTime = undefined;

  bufferedTime = newTime = this.player_.seekable();

  if (bufferedTime && bufferedTime.length) {
    var progress = this.calculateDistance(e) * this.dvrTotalTime(this.player_);

    newTime = bufferedTime.start(0) + progress;
    for (; newTime >= bufferedTime.end(0);) {
      newTime -= 0.1;
    }

    this.player_.currentTime(newTime);
  }
};

SeekBar.prototype.updateAriaAttributes = function () {
  var seekableRanges = this.player_.seekable() || [];

  if (seekableRanges.length) {
    var lastSeekableTime = seekableRanges.end(0);
    var cachedCTime = this.player_.getCache().currentTime;
    var currentTime = this.player_.scrubbing ? cachedCTime : this.player_.currentTime();
    var timeToLastSeekable = undefined;

    // Get difference between last seekable moment and current time
    timeToLastSeekable = lastSeekableTime - currentTime;
    if (timeToLastSeekable < 0) {
      timeToLastSeekable = 0;
    }

    // Update current time control
    var formattedTime = _videoJs2['default'].formatTime(timeToLastSeekable, lastSeekableTime);
    var formattedPercentage = Math.round(100 * this.getPercent(), 2);

    this.el_.setAttribute('aria-valuenow', formattedPercentage);
    this.el_.setAttribute('aria-valuetext', (currentTime ? '' : '-') + formattedTime);
  }
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
var onPlayerReady = function onPlayerReady(player, options) {
  player.addClass('vjs-dvrseekbar');
  player.controlBar.addClass('vjs-dvrseekbar-control-bar');

  if (player.controlBar.progressControl) {
    player.controlBar.progressControl.addClass('vjs-dvrseekbar-progress-control');
  }

  // ADD Live Button:
  var btnLiveEl = document.createElement('div');
  var newLink = document.createElement('a');

  btnLiveEl.className = 'vjs-live-button vjs-control';

  newLink.innerHTML = document.getElementById(player.id_).getElementsByClassName('vjs-live-display')[0].innerHTML;
  newLink.id = 'liveButton_' + player.id_;

  if (!player.paused()) {
    newLink.className = 'vjs-live-label onair';
  }

  var clickHandler = function clickHandler(e) {
    player.currentTime(player.seekable().end(0));
    player.play();
  };

  if (newLink.addEventListener) {
    // DOM method
    newLink.addEventListener('click', clickHandler, false);
  } else if (newLink.attachEvent) {
    // this is for IE, because it doesn't support addEventListener
    newLink.attachEvent('onclick', function () {
      return clickHandler.apply(newLink, [window.event]);
    });
  }

  btnLiveEl.appendChild(newLink);

  var controlBar = document.getElementById(player.id_).getElementsByClassName('vjs-control-bar')[0];
  var insertBeforeNode = document.getElementById(player.id_).getElementsByClassName('vjs-progress-control')[0];

  controlBar.insertBefore(btnLiveEl, insertBeforeNode);

  _videoJs2['default'].log('dvrSeekbar Plugin ENABLED!', options);
};

var onTimeUpdate = function onTimeUpdate(player, e) {
  var time = player.seekable();
  var btnLiveEl = document.getElementById('liveButton_' + player.id_);

  // When any tech is disposed videojs will trigger a 'timeupdate' event
  // when calling stopTrackingCurrentTime(). If the tech does not have
  // a seekable() method, time will be undefined
  if (!time || !time.length) {
    return;
  }

  player.duration(player.seekable().end(0));

  if (time.end(0) - player.currentTime() < 30) {
    btnLiveEl.className = 'label onair';
  } else {
    btnLiveEl.className = 'label';
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
var dvrseekbar = function dvrseekbar(options) {
  var _this = this;

  if (!options) {
    options = defaults;
  }

  this.on('timeupdate', function (e) {
    onTimeUpdate(_this, e);
  });

  this.on('play', function (e) {});

  this.on('pause', function (e) {
    var btnLiveEl = document.getElementById('liveButton_' + _this.id_);

    btnLiveEl.className = 'vjs-live-label';
  });

  this.ready(function () {
    onPlayerReady(_this, _videoJs2['default'].mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
// Updated for video.js 6 - https://github.com/videojs/video.js/wiki/Video.js-6-Migration-Guide
var registerPlugin = _videoJs2['default'].registerPlugin || _videoJs2['default'].plugin;

registerPlugin('dvrseekbar', dvrseekbar);

// Include the version number.
dvrseekbar.VERSION = '0.2.6';

exports['default'] = dvrseekbar;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});