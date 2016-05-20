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
      if (newTime == this.player_.duration()) {
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

  //Register custom DVRSeekBar Component:
  _videoJs2['default'].registerComponent('DVRSeekBar', DVRSeekBar);

  /* TODO!!!!
  if (options.isLive) { // if live stream
      if (player.getChild('DVRSeekBar') === undefined) {
          player.removeChild('seekBar');
          player.removeChild('timeDivider');
          player.removeChild('durationDisplay');
          player.addChild('DVRSeekBar', options);
      }
  } else { // if on-demand
      if (player.getChild('DVRSeekBar') !== undefined) {
          player.removeChild('DVRSeekBar');
          player.addChild('timeDivider');
          player.addChild('durationDisplay');
          player.addChild('seekBar');
      }
      return;
  }*/

  this.on('timeupdate', function (e) {
    onTimeUpdate(_this, e);
  });

  this.ready(function () {
    onPlayerReady(_this, _videoJs2['default'].mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
_videoJs2['default'].plugin('dvrseekbar', dvrseekbar);

// Include the version number.
dvrseekbar.VERSION = '0.0.5';

exports['default'] = dvrseekbar;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQ0FvQixVQUFVOzs7OztBQUU5QixJQUFNLFFBQVEsR0FBRztBQUNmLFdBQVMsRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUNGLElBQU0sT0FBTyxHQUFHLHFCQUFRLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7O0lBSzFDLFVBQVU7WUFBVixVQUFVOzs7O0FBR0gsV0FIUCxVQUFVLENBR0YsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFIekIsVUFBVTs7QUFLWiwrQkFMRSxVQUFVLDZDQUtOLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0dBQ3BDOzs7Ozs7Ozs7Ozs7OztlQVBHLFVBQVU7O1dBU0MseUJBQUMsQ0FBQyxFQUFFO0FBQ2xCLFVBQUksWUFBWSxZQUFBO1VBQUUsT0FBTyxZQUFBLENBQUM7O0FBRXpCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3RELFlBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNsRCxvQkFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbkUsZUFBTyxHQUFHLEFBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxZQUFZLEdBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQUFBQyxDQUFDO09BRXRHLE1BQU07QUFDSCxzQkFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDaEUsaUJBQU8sR0FBRyxBQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsWUFBWSxHQUFLLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLEFBQUMsQ0FBQztTQUVuRztBQUNELFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFOztBQUNsQyxlQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7T0FDcEM7O0FBRUQsVUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRTtBQUNwQyxlQUFPLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQztPQUMzQjs7O0FBR0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbkM7OztTQWhDRyxVQUFVO0dBQVMsT0FBTzs7QUErQ2hDLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxNQUFNLEVBQUUsT0FBTyxFQUFLO0FBQ3pDLFFBQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNsQyx1QkFBUSxHQUFHLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDcEQsQ0FBQzs7QUFFRixJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxNQUFNLEVBQUUsQ0FBQyxFQUFLOztBQUVsQyxRQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0NBQ3ZDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBZUYsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQVksT0FBTyxFQUFFOzs7QUFDbkMsTUFBTSxNQUFNLEdBQUksSUFBSSxDQUFDOztBQUVyQixNQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osV0FBTyxHQUFHLFFBQVEsQ0FBQztHQUNwQjs7QUFFRCxNQUFJLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUdqRCx1QkFBUSxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JwRCxNQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFDLENBQUMsRUFBSztBQUMzQixnQkFBWSxRQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsS0FBSyxDQUFDLFlBQU07QUFDZixpQkFBYSxRQUFPLHFCQUFRLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztHQUM5RCxDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFHRixxQkFBUSxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDOzs7QUFHekMsVUFBVSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7O3FCQUVwQixVQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB2aWRlb2pzIGZyb20gJ3ZpZGVvLmpzJztcbi8vIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHBsdWdpbi5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBzdGFydFRpbWU6IDBcbn07XG5jb25zdCBTZWVrQmFyID0gdmlkZW9qcy5nZXRDb21wb25lbnQoJ1NlZWtCYXInKTtcblxuLyoqXG4gKiBTZWVrQmFyIHdpdGggRFZSIHN1cHBvcnQgY2xhc3NcbiAqL1xuY2xhc3MgRFZSU2Vla0JhciBleHRlbmRzIFNlZWtCYXIge1xuXG4gIC8qKiBAY29uc3RydWN0b3IgKi9cbiAgY29uc3RydWN0b3IocGxheWVyLCBvcHRpb25zKSB7XG5cbiAgICBzdXBlcihwbGF5ZXIsIG9wdGlvbnMpO1xuICAgIHRoaXMuc3RhcnRUaW1lID0gb3B0aW9ucy5zdGFydFRpbWU7XG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUoZSkge1xuICAgbGV0IGJ1ZmZlcmVkVGltZSwgbmV3VGltZTtcblxuICAgIGlmICh0aGlzLnBsYXllcl8uZHVyYXRpb24oKSA8IHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpKSB7XG4gICAgICAgIHRoaXMucGxheWVyXy5kdXJhdGlvbih0aGlzLnBsYXllcl8uY3VycmVudFRpbWUoKSk7XG4gICAgICAgIGJ1ZmZlcmVkVGltZSA9IHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpIC0gdGhpcy5vcHRpb25zLnN0YXJ0VGltZTtcbiAgICAgICAgbmV3VGltZSA9ICh0aGlzLnBsYXllcl8uY3VycmVudFRpbWUoKSAtIGJ1ZmZlcmVkVGltZSkgKyAodGhpcy5jYWxjdWxhdGVEaXN0YW5jZShlKSAqIGJ1ZmZlcmVkVGltZSk7IC8vIG9ubHkgc2VhcmNoIGluIGJ1ZmZlclxuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnVmZmVyZWRUaW1lID0gdGhpcy5wbGF5ZXJfLmR1cmF0aW9uKCkgLSB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lO1xuICAgICAgICBuZXdUaW1lID0gKHRoaXMucGxheWVyXy5kdXJhdGlvbigpIC0gYnVmZmVyZWRUaW1lKSArICh0aGlzLmNhbGN1bGF0ZURpc3RhbmNlKGUpICogYnVmZmVyZWRUaW1lKTsgLy8gb25seSBzZWFyY2ggaW4gYnVmZmVyXG5cbiAgICB9XG4gICAgaWYgKG5ld1RpbWUgPCB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lKSB7IC8vIGlmIGNhbGN1bGF0ZWQgdGltZSB3YXMgbm90IHBsYXllZCBvbmNlLlxuICAgICAgICBuZXdUaW1lID0gdGhpcy5vcHRpb25zLnN0YXJ0VGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgbGV0IHZpZGVvIGVuZCB3aGlsZSBzY3J1YmJpbmcuXG4gICAgaWYgKG5ld1RpbWUgPT0gdGhpcy5wbGF5ZXJfLmR1cmF0aW9uKCkpIHtcbiAgICAgICAgbmV3VGltZSA9IG5ld1RpbWUgLSAwLjE7XG4gICAgfVxuXG4gICAgLy8gU2V0IG5ldyB0aW1lICh0ZWxsIHBsYXllciB0byBzZWVrIHRvIG5ldyB0aW1lKVxuICAgIHRoaXMucGxheWVyXy5jdXJyZW50VGltZShuZXdUaW1lKTtcbiAgfVxuXG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeS5cbiAqXG4gKiBUaGlzIGlzIGEgZ3JlYXQgcGxhY2UgZm9yIHlvdXIgcGx1Z2luIHRvIGluaXRpYWxpemUgaXRzZWxmLiBXaGVuIHRoaXNcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIHBsYXllciB3aWxsIGhhdmUgaXRzIERPTSBhbmQgY2hpbGQgY29tcG9uZW50c1xuICogaW4gcGxhY2UuXG4gKlxuICogQGZ1bmN0aW9uIG9uUGxheWVyUmVhZHlcbiAqIEBwYXJhbSAgICB7UGxheWVyfSBwbGF5ZXJcbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqL1xuY29uc3Qgb25QbGF5ZXJSZWFkeSA9IChwbGF5ZXIsIG9wdGlvbnMpID0+IHtcbiAgcGxheWVyLmFkZENsYXNzKCd2anMtZHZyc2Vla2JhcicpO1xuICB2aWRlb2pzLmxvZygnZHZyU2Vla2JhciBQbHVnaW4gRU5BQkxFRCEnLCBvcHRpb25zKTtcbn07XG5cbmNvbnN0IG9uVGltZVVwZGF0ZSA9IChwbGF5ZXIsIGUpID0+IHtcblxuICBwbGF5ZXIuZHVyYXRpb24ocGxheWVyLmN1cnJlbnRUaW1lKCkpO1xufTtcblxuXG4vKipcbiAqIEEgdmlkZW8uanMgcGx1Z2luLlxuICpcbiAqIEluIHRoZSBwbHVnaW4gZnVuY3Rpb24sIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaXMgYSB2aWRlby5qcyBgUGxheWVyYFxuICogaW5zdGFuY2UuIFlvdSBjYW5ub3QgcmVseSBvbiB0aGUgcGxheWVyIGJlaW5nIGluIGEgXCJyZWFkeVwiIHN0YXRlIGhlcmUsXG4gKiBkZXBlbmRpbmcgb24gaG93IHRoZSBwbHVnaW4gaXMgaW52b2tlZC4gVGhpcyBtYXkgb3IgbWF5IG5vdCBiZSBpbXBvcnRhbnRcbiAqIHRvIHlvdTsgaWYgbm90LCByZW1vdmUgdGhlIHdhaXQgZm9yIFwicmVhZHlcIiFcbiAqXG4gKiBAZnVuY3Rpb24gZHZyc2Vla2JhclxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICogICAgICAgICAgIEFuIG9iamVjdCBvZiBvcHRpb25zIGxlZnQgdG8gdGhlIHBsdWdpbiBhdXRob3IgdG8gZGVmaW5lLlxuICovXG5jb25zdCBkdnJzZWVrYmFyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBjb25zdCBwbGF5ZXIgID0gdGhpcztcblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdHM7XG4gIH1cblxuICBsZXQgZHZyU2Vla0JhciA9IG5ldyBEVlJTZWVrQmFyKHBsYXllciwgb3B0aW9ucyk7XG5cbiAgLy9SZWdpc3RlciBjdXN0b20gRFZSU2Vla0JhciBDb21wb25lbnQ6XG4gIHZpZGVvanMucmVnaXN0ZXJDb21wb25lbnQoJ0RWUlNlZWtCYXInLCBEVlJTZWVrQmFyKTtcblxuICAvKiBUT0RPISEhIVxuICBpZiAob3B0aW9ucy5pc0xpdmUpIHsgLy8gaWYgbGl2ZSBzdHJlYW1cbiAgICAgIGlmIChwbGF5ZXIuZ2V0Q2hpbGQoJ0RWUlNlZWtCYXInKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcGxheWVyLnJlbW92ZUNoaWxkKCdzZWVrQmFyJyk7XG4gICAgICAgICAgcGxheWVyLnJlbW92ZUNoaWxkKCd0aW1lRGl2aWRlcicpO1xuICAgICAgICAgIHBsYXllci5yZW1vdmVDaGlsZCgnZHVyYXRpb25EaXNwbGF5Jyk7XG4gICAgICAgICAgcGxheWVyLmFkZENoaWxkKCdEVlJTZWVrQmFyJywgb3B0aW9ucyk7XG4gICAgICB9XG4gIH0gZWxzZSB7IC8vIGlmIG9uLWRlbWFuZFxuICAgICAgaWYgKHBsYXllci5nZXRDaGlsZCgnRFZSU2Vla0JhcicpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwbGF5ZXIucmVtb3ZlQ2hpbGQoJ0RWUlNlZWtCYXInKTtcbiAgICAgICAgICBwbGF5ZXIuYWRkQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgICAgICAgcGxheWVyLmFkZENoaWxkKCdkdXJhdGlvbkRpc3BsYXknKTtcbiAgICAgICAgICBwbGF5ZXIuYWRkQ2hpbGQoJ3NlZWtCYXInKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgfSovXG5cbiAgdGhpcy5vbigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgb25UaW1lVXBkYXRlKHRoaXMsIGUpO1xuICB9KTtcblxuICB0aGlzLnJlYWR5KCgpID0+IHtcbiAgICBvblBsYXllclJlYWR5KHRoaXMsIHZpZGVvanMubWVyZ2VPcHRpb25zKGRlZmF1bHRzLCBvcHRpb25zKSk7XG4gIH0pO1xufTtcblxuLy8gUmVnaXN0ZXIgdGhlIHBsdWdpbiB3aXRoIHZpZGVvLmpzLlxudmlkZW9qcy5wbHVnaW4oJ2R2cnNlZWtiYXInLCBkdnJzZWVrYmFyKTtcblxuLy8gSW5jbHVkZSB0aGUgdmVyc2lvbiBudW1iZXIuXG5kdnJzZWVrYmFyLlZFUlNJT04gPSAnX19WRVJTSU9OX18nO1xuXG5leHBvcnQgZGVmYXVsdCBkdnJzZWVrYmFyO1xuIl19
