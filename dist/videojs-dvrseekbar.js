/**
 * videojs-dvrseekbar
 * @version 0.2.5
 * @copyright 2016 ToolBox-tve
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsDvrseekbar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

// Default options for the plugin.
var defaults = {
  startTime: 0
};
var SeekBar = _videoJs2['default'].getComponent('SeekBar');

/**
 * SeekBar with DVR support class
 */

var DVRSeekBar = (function (_SeekBar) {
  _inherits(DVRSeekBar, _SeekBar);

  /** @constructor */

  function DVRSeekBar(player, options) {
    _classCallCheck(this, DVRSeekBar);

    _get(Object.getPrototypeOf(DVRSeekBar.prototype), 'constructor', this).call(this, player, options);
    this.startTime = options.startTime;
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

  _createClass(DVRSeekBar, [{
    key: 'handleMouseMove',
    value: function handleMouseMove(e) {
      var bufferedTime = undefined,
          newTime = undefined;

      if (this.player_.duration() < this.player_.currentTime()) {
        this.player_.duration(this.player_.currentTime());
        bufferedTime = this.player_.currentTime() - this.options.startTime;
        newTime = this.player_.currentTime() - bufferedTime + this.calculateDistance(e) * bufferedTime; // only search in buffer
      } else {
          bufferedTime = this.player_.duration() - this.options.startTime;
          newTime = this.player_.duration() - bufferedTime + this.calculateDistance(e) * bufferedTime; // only search in buffer
        }
      if (newTime < this.options.startTime) {
        // if calculated time was not played once.
        newTime = this.options.startTime;
      }
      // Don't let video end while scrubbing.
      if (newTime === this.player_.duration()) {
        newTime = newTime - 0.1;
      }

      // Set new time (tell player to seek to new time)
      this.player_.currentTime(newTime);
    }
  }]);

  return DVRSeekBar;
})(SeekBar);

var onPlayerReady = function onPlayerReady(player, options) {
  player.addClass('vjs-dvrseekbar');
  player.controlBar.addClass('vjs-dvrseekbar-control-bar');

  if (player.controlBar.progressControl) {
    player.controlBar.progressControl.addClass('vjs-dvrseekbar-progress-control');
  }

  // ADD Live Button:
  var btnLiveEl = document.createElement('div'),
      newLink = document.createElement('button');

  btnLiveEl.className = 'vjs-live-button vjs-control';

  newLink.innerHTML = document.getElementsByClassName('vjs-live-display')[0].innerHTML;
  newLink.id = 'liveButton';

  if (!player.paused()) {
    newLink.className = 'vjs-live-label onair';
  }

  /*
  let clickHandler = function() {
    player.pause();
    player.currentTime(0);
     player.play();
  };
   if (newLink.addEventListener) { // DOM method
    newLink.addEventListener('click', clickHandler, false);
  } else if (newLink.attachEvent) { // this is for IE, because it doesn't support addEventListener
    newLink.attachEvent('onclick', function() { return clickHandler.apply(newLink, [ window.event ]); });
  }
  */
  btnLiveEl.appendChild(newLink);

  var controlBar = document.getElementsByClassName('vjs-control-bar')[0],
      insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];

  controlBar.insertBefore(btnLiveEl, insertBeforeNode);

  _videoJs2['default'].log('dvrSeekbar Plugin ENABLED!', options);
};

var onTimeUpdate = function onTimeUpdate(player, e) {

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
var dvrseekbar = function dvrseekbar(options) {
  var _this = this;

  var player = this;

  if (!options) {
    options = defaults;
  }

  var dvrSeekBar = new DVRSeekBar(player, options);

  // Register custom DVRSeekBar Component:
  _videoJs2['default'].registerComponent('DVRSeekBar', dvrSeekBar);

  this.on('timeupdate', function (e) {
    onTimeUpdate(_this, e);
  });

  this.on('play', function (e) {
    var btnLiveEl = document.getElementById('liveButton');

    if (btnLiveEl) {
      btnLiveEl.className = 'vjs-live-label onair';
      btnLiveEl.innerHTML = '<span class="vjs-control-text">Stream Type</span>LIVE';
    }
  });

  this.on('pause', function (e) {
    var btnLiveEl = document.getElementById('liveButton');

    btnLiveEl.className = '';
  });

  this.on('seeked', function (e) {
    /* let btnLiveEl = document.getElementById('liveButton');
     if (player.duration() < player.currentTime()) {
        btnLiveEl.className = 'vjs-live-label';
        btnLiveEl.innerHTML = '<span class="vjs-control-text">Stream Type</span>DVR';
    } */
  });

  this.ready(function () {
    onPlayerReady(_this, _videoJs2['default'].mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
_videoJs2['default'].plugin('dvrseekbar', dvrseekbar);

// Include the version number.
dvrseekbar.VERSION = '0.2.5';

exports['default'] = dvrseekbar;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});