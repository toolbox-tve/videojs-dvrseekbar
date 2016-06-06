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
  player.controlBar.addClass('vjs-dvrseekbar-control-bar');

  if (player.controlBar.progressControl) {
    player.controlBar.progressControl.addClass('vjs-dvrseekbar-progress-control');
  }

  // ADD Live Button:
  var btnLiveEl = document.createElement('div'),
      newLink = document.createElement('a');

  btnLiveEl.className = 'vjs-live-button vjs-control';

  newLink.innerHTML = document.getElementsByClassName('vjs-live-display')[0].innerHTML;
  newLink.id = 'liveButton';

  if (!player.paused()) {
    newLink.className = 'label onair';
  }

  var clickHandler = function clickHandler() {
    player.pause();
    player.currentTime(0);
    //player.load();
    player.play();
  };

  if (newLink.addEventListener) // DOM method
    newLink.addEventListener('click', clickHandler, false);else if (anchor.attachEvent) // this is for IE, because it doesn't support addEventListener
    newLink.attachEvent('onclick', function () {
      return clickHandler.apply(newLink, [window.event]);
    });

  btnLiveEl.appendChild(newLink);

  var controlBar = document.getElementsByClassName('vjs-control-bar')[0],
      insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];

  controlBar.insertBefore(btnLiveEl, insertBeforeNode);

  _videoJs2['default'].log('dvrSeekbar Plugin ENABLED!', options);
};

var onTimeUpdate = function onTimeUpdate(player, e) {

  player.duration(player.currentTime());
};

var onPlay = function onPlay(player, e) {
  var btnLiveEl = document.getElementById('liveButton');

  btnLiveEl.className = 'label onair';
  btnLiveEl.innerHTML = '<span class="vjs-control-text">Stream Type</span>LIVE';
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

  this.on('timeupdate', function (e) {
    onTimeUpdate(_this, e);
  });

  this.on('play', function (e) {
    onPlay(_this, e);
  });

  this.on('pause', function (e) {
    var btnLiveEl = document.getElementById('liveButton');

    btnLiveEl.className = '';
  });

  this.on('seeked', function (e) {
    var btnLiveEl = document.getElementById('liveButton');

    if (player.duration() < player.currentTime()) {
      btnLiveEl.className = 'label';
      btnLiveEl.innerHTML = '<span class="vjs-control-text">Stream Type</span>DVR';
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQ0FvQixVQUFVOzs7OztBQUU5QixJQUFNLFFBQVEsR0FBRztBQUNmLFdBQVMsRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUNGLElBQU0sT0FBTyxHQUFHLHFCQUFRLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7O0lBSzFDLFVBQVU7WUFBVixVQUFVOzs7O0FBR0gsV0FIUCxVQUFVLENBR0YsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFIekIsVUFBVTs7QUFLWiwrQkFMRSxVQUFVLDZDQUtOLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0dBQ3BDOzs7Ozs7Ozs7Ozs7OztlQVBHLFVBQVU7O1dBU0MseUJBQUMsQ0FBQyxFQUFFO0FBQ2xCLFVBQUksWUFBWSxZQUFBO1VBQUUsT0FBTyxZQUFBLENBQUM7O0FBRXpCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3RELFlBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNsRCxvQkFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbkUsZUFBTyxHQUFHLEFBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxZQUFZLEdBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQUFBQyxDQUFD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QUFDOztBQUV0RCxhQUFTLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztHQUMxQixDQUFDLENBQUM7O0FBRUgsTUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDdkIsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdEQsUUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQzFDLGVBQVMsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQzlCLGVBQVMsQ0FBQyxTQUFTLEdBQUcsc0RBQXNELENBQUM7S0FDaEY7R0FDRixDQUFDLENBQUM7O0FBRUgsTUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFNO0FBQ2YsaUJBQWEsUUFBTyxxQkFBUSxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDOUQsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7O0FBR0YscUJBQVEsTUFBTSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQzs7O0FBR3pDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDOztxQkFFcEIsVUFBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgdmlkZW9qcyBmcm9tICd2aWRlby5qcyc7XG4vLyBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwbHVnaW4uXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgc3RhcnRUaW1lOiAwXG59O1xuY29uc3QgU2Vla0JhciA9IHZpZGVvanMuZ2V0Q29tcG9uZW50KCdTZWVrQmFyJyk7XG5cbi8qKlxuICogU2Vla0JhciB3aXRoIERWUiBzdXBwb3J0IGNsYXNzXG4gKi9cbmNsYXNzIERWUlNlZWtCYXIgZXh0ZW5kcyBTZWVrQmFyIHtcblxuICAvKiogQGNvbnN0cnVjdG9yICovXG4gIGNvbnN0cnVjdG9yKHBsYXllciwgb3B0aW9ucykge1xuXG4gICAgc3VwZXIocGxheWVyLCBvcHRpb25zKTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lO1xuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlKGUpIHtcbiAgIGxldCBidWZmZXJlZFRpbWUsIG5ld1RpbWU7XG5cbiAgICBpZiAodGhpcy5wbGF5ZXJfLmR1cmF0aW9uKCkgPCB0aGlzLnBsYXllcl8uY3VycmVudFRpbWUoKSkge1xuICAgICAgICB0aGlzLnBsYXllcl8uZHVyYXRpb24odGhpcy5wbGF5ZXJfLmN1cnJlbnRUaW1lKCkpO1xuICAgICAgICBidWZmZXJlZFRpbWUgPSB0aGlzLnBsYXllcl8uY3VycmVudFRpbWUoKSAtIHRoaXMub3B0aW9ucy5zdGFydFRpbWU7XG4gICAgICAgIG5ld1RpbWUgPSAodGhpcy5wbGF5ZXJfLmN1cnJlbnRUaW1lKCkgLSBidWZmZXJlZFRpbWUpICsgKHRoaXMuY2FsY3VsYXRlRGlzdGFuY2UoZSkgKiBidWZmZXJlZFRpbWUpOyAvLyBvbmx5IHNlYXJjaCBpbiBidWZmZXJcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZmZlcmVkVGltZSA9IHRoaXMucGxheWVyXy5kdXJhdGlvbigpIC0gdGhpcy5vcHRpb25zLnN0YXJ0VGltZTtcbiAgICAgICAgbmV3VGltZSA9ICh0aGlzLnBsYXllcl8uZHVyYXRpb24oKSAtIGJ1ZmZlcmVkVGltZSkgKyAodGhpcy5jYWxjdWxhdGVEaXN0YW5jZShlKSAqIGJ1ZmZlcmVkVGltZSk7IC8vIG9ubHkgc2VhcmNoIGluIGJ1ZmZlclxuXG4gICAgfVxuICAgIGlmIChuZXdUaW1lIDwgdGhpcy5vcHRpb25zLnN0YXJ0VGltZSkgeyAvLyBpZiBjYWxjdWxhdGVkIHRpbWUgd2FzIG5vdCBwbGF5ZWQgb25jZS5cbiAgICAgICAgbmV3VGltZSA9IHRoaXMub3B0aW9ucy5zdGFydFRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGxldCB2aWRlbyBlbmQgd2hpbGUgc2NydWJiaW5nLlxuICAgIGlmIChuZXdUaW1lID09IHRoaXMucGxheWVyXy5kdXJhdGlvbigpKSB7XG4gICAgICAgIG5ld1RpbWUgPSBuZXdUaW1lIC0gMC4xO1xuICAgIH1cblxuICAgIC8vIFNldCBuZXcgdGltZSAodGVsbCBwbGF5ZXIgdG8gc2VlayB0byBuZXcgdGltZSlcbiAgICB0aGlzLnBsYXllcl8uY3VycmVudFRpbWUobmV3VGltZSk7XG4gIH1cblxufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGludm9rZSB3aGVuIHRoZSBwbGF5ZXIgaXMgcmVhZHkuXG4gKlxuICogVGhpcyBpcyBhIGdyZWF0IHBsYWNlIGZvciB5b3VyIHBsdWdpbiB0byBpbml0aWFsaXplIGl0c2VsZi4gV2hlbiB0aGlzXG4gKiBmdW5jdGlvbiBpcyBjYWxsZWQsIHRoZSBwbGF5ZXIgd2lsbCBoYXZlIGl0cyBET00gYW5kIGNoaWxkIGNvbXBvbmVudHNcbiAqIGluIHBsYWNlLlxuICpcbiAqIEBmdW5jdGlvbiBvblBsYXllclJlYWR5XG4gKiBAcGFyYW0gICAge1BsYXllcn0gcGxheWVyXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKi9cbmNvbnN0IG9uUGxheWVyUmVhZHkgPSAocGxheWVyLCBvcHRpb25zKSA9PiB7XG4gIHBsYXllci5hZGRDbGFzcygndmpzLWR2cnNlZWtiYXInKTtcbiAgcGxheWVyLmNvbnRyb2xCYXIuYWRkQ2xhc3MoJ3Zqcy1kdnJzZWVrYmFyLWNvbnRyb2wtYmFyJyk7XG5cbiAgaWYgKHBsYXllci5jb250cm9sQmFyLnByb2dyZXNzQ29udHJvbCkge1xuICAgIHBsYXllci5jb250cm9sQmFyLnByb2dyZXNzQ29udHJvbC5hZGRDbGFzcygndmpzLWR2cnNlZWtiYXItcHJvZ3Jlc3MtY29udHJvbCcpO1xuICB9XG5cbiAgLy8gQUREIExpdmUgQnV0dG9uOlxuICBsZXQgYnRuTGl2ZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgbmV3TGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJ3Zqcy1saXZlLWJ1dHRvbiB2anMtY29udHJvbCc7XG5cbiAgbmV3TGluay5pbm5lckhUTUwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtbGl2ZS1kaXNwbGF5JylbMF0uaW5uZXJIVE1MO1xuICBuZXdMaW5rLmlkID0gJ2xpdmVCdXR0b24nO1xuXG4gIGlmICghcGxheWVyLnBhdXNlZCgpKSB7XG4gICAgbmV3TGluay5jbGFzc05hbWUgPSAnbGFiZWwgb25haXInO1xuICB9XG5cbiAgbGV0IGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICBwbGF5ZXIuY3VycmVudFRpbWUoMCk7XG4gICAgLy9wbGF5ZXIubG9hZCgpO1xuICAgIHBsYXllci5wbGF5KCk7XG4gIH07XG5cbiAgaWYobmV3TGluay5hZGRFdmVudExpc3RlbmVyKSAvLyBET00gbWV0aG9kXG4gICAgbmV3TGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlciwgZmFsc2UpO1xuICBlbHNlIGlmKGFuY2hvci5hdHRhY2hFdmVudCkgLy8gdGhpcyBpcyBmb3IgSUUsIGJlY2F1c2UgaXQgZG9lc24ndCBzdXBwb3J0IGFkZEV2ZW50TGlzdGVuZXJcbiAgICBuZXdMaW5rLmF0dGFjaEV2ZW50KCdvbmNsaWNrJywgZnVuY3Rpb24oKXsgcmV0dXJuIGNsaWNrSGFuZGxlci5hcHBseShuZXdMaW5rLCBbd2luZG93LmV2ZW50XSl9KTtcblxuICBidG5MaXZlRWwuYXBwZW5kQ2hpbGQobmV3TGluayk7XG5cbiAgbGV0IGNvbnRyb2xCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtY29udHJvbC1iYXInKVswXSxcbiAgaW5zZXJ0QmVmb3JlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Zqcy1wcm9ncmVzcy1jb250cm9sJylbMF07XG5cbiAgY29udHJvbEJhci5pbnNlcnRCZWZvcmUoYnRuTGl2ZUVsLCBpbnNlcnRCZWZvcmVOb2RlKTtcblxuICB2aWRlb2pzLmxvZygnZHZyU2Vla2JhciBQbHVnaW4gRU5BQkxFRCEnLCBvcHRpb25zKTtcbn07XG5cbmNvbnN0IG9uVGltZVVwZGF0ZSA9IChwbGF5ZXIsIGUpID0+IHtcblxuICBwbGF5ZXIuZHVyYXRpb24ocGxheWVyLmN1cnJlbnRUaW1lKCkpO1xufTtcblxuY29uc3Qgb25QbGF5ID0gKHBsYXllciwgZSkgPT4ge1xuICBsZXQgYnRuTGl2ZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpdmVCdXR0b24nKTtcblxuICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJ2xhYmVsIG9uYWlyJztcbiAgYnRuTGl2ZUVsLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cInZqcy1jb250cm9sLXRleHRcIj5TdHJlYW0gVHlwZTwvc3Bhbj5MSVZFJztcbn07XG5cbi8qKlxuICogQSB2aWRlby5qcyBwbHVnaW4uXG4gKlxuICogSW4gdGhlIHBsdWdpbiBmdW5jdGlvbiwgdGhlIHZhbHVlIG9mIGB0aGlzYCBpcyBhIHZpZGVvLmpzIGBQbGF5ZXJgXG4gKiBpbnN0YW5jZS4gWW91IGNhbm5vdCByZWx5IG9uIHRoZSBwbGF5ZXIgYmVpbmcgaW4gYSBcInJlYWR5XCIgc3RhdGUgaGVyZSxcbiAqIGRlcGVuZGluZyBvbiBob3cgdGhlIHBsdWdpbiBpcyBpbnZva2VkLiBUaGlzIG1heSBvciBtYXkgbm90IGJlIGltcG9ydGFudFxuICogdG8geW91OyBpZiBub3QsIHJlbW92ZSB0aGUgd2FpdCBmb3IgXCJyZWFkeVwiIVxuICpcbiAqIEBmdW5jdGlvbiBkdnJzZWVrYmFyXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKiAgICAgICAgICAgQW4gb2JqZWN0IG9mIG9wdGlvbnMgbGVmdCB0byB0aGUgcGx1Z2luIGF1dGhvciB0byBkZWZpbmUuXG4gKi9cbmNvbnN0IGR2cnNlZWtiYXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGNvbnN0IHBsYXllciAgPSB0aGlzO1xuXG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cztcbiAgfVxuXG4gIGxldCBkdnJTZWVrQmFyID0gbmV3IERWUlNlZWtCYXIocGxheWVyLCBvcHRpb25zKTtcblxuICAvL1JlZ2lzdGVyIGN1c3RvbSBEVlJTZWVrQmFyIENvbXBvbmVudDpcbiAgdmlkZW9qcy5yZWdpc3RlckNvbXBvbmVudCgnRFZSU2Vla0JhcicsIERWUlNlZWtCYXIpO1xuXG4gIHRoaXMub24oJ3RpbWV1cGRhdGUnLCAoZSkgPT4ge1xuICAgIG9uVGltZVVwZGF0ZSh0aGlzLCBlKTtcbiAgfSk7XG5cbiAgdGhpcy5vbigncGxheScsIChlKSA9PiB7XG4gICAgb25QbGF5KHRoaXMsIGUpO1xuICB9KTtcblxuICB0aGlzLm9uKCdwYXVzZScsIChlKSA9PiB7XG4gICAgbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlQnV0dG9uJyk7XG5cbiAgICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJyc7XG4gIH0pO1xuXG4gIHRoaXMub24oJ3NlZWtlZCcsIChlKSA9PiB7XG4gICAgbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlQnV0dG9uJyk7XG5cbiAgICBpZiAocGxheWVyLmR1cmF0aW9uKCkgPCBwbGF5ZXIuY3VycmVudFRpbWUoKSkge1xuICAgICAgICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICAgICAgYnRuTGl2ZUVsLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cInZqcy1jb250cm9sLXRleHRcIj5TdHJlYW0gVHlwZTwvc3Bhbj5EVlInO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5yZWFkeSgoKSA9PiB7XG4gICAgb25QbGF5ZXJSZWFkeSh0aGlzLCB2aWRlb2pzLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbnZpZGVvanMucGx1Z2luKCdkdnJzZWVrYmFyJywgZHZyc2Vla2Jhcik7XG5cbi8vIEluY2x1ZGUgdGhlIHZlcnNpb24gbnVtYmVyLlxuZHZyc2Vla2Jhci5WRVJTSU9OID0gJ19fVkVSU0lPTl9fJztcblxuZXhwb3J0IGRlZmF1bHQgZHZyc2Vla2JhcjtcbiJdfQ==
