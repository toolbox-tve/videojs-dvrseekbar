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
  if (btnLiveEl) {
    btnLiveEl.className = 'label onair';
  }
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
    console.log('SEEKED!');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQ0FvQixVQUFVOzs7OztBQUU5QixJQUFNLFFBQVEsR0FBRztBQUNmLFdBQVMsRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUNGLElBQU0sT0FBTyxHQUFHLHFCQUFRLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7O0lBSzFDLFVBQVU7WUFBVixVQUFVOzs7O0FBR0gsV0FIUCxVQUFVLENBR0YsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFIekIsVUFBVTs7QUFLWiwrQkFMRSxVQUFVLDZDQUtOLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0dBQ3BDOzs7Ozs7Ozs7Ozs7OztlQVBHLFVBQVU7O1dBU0MseUJBQUMsQ0FBQyxFQUFFO0FBQ2xCLFVBQUksWUFBWSxZQUFBO1VBQUUsT0FBTyxZQUFBLENBQUM7O0FBRXpCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3RELFlBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNsRCxvQkFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbkUsZUFBTyxHQUFHLEFBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxZQUFZLEdBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQUFBQyxDQUFD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UyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7R0FDMUIsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ3ZCLFdBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDeEIsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxLQUFLLENBQUMsWUFBTTtBQUNmLGlCQUFhLFFBQU8scUJBQVEsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0dBQzlELENBQUMsQ0FBQztDQUNKLENBQUM7OztBQUdGLHFCQUFRLE1BQU0sQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7OztBQUd6QyxVQUFVLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQzs7cUJBRXBCLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHZpZGVvanMgZnJvbSAndmlkZW8uanMnO1xuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHN0YXJ0VGltZTogMFxufTtcbmNvbnN0IFNlZWtCYXIgPSB2aWRlb2pzLmdldENvbXBvbmVudCgnU2Vla0JhcicpO1xuXG4vKipcbiAqIFNlZWtCYXIgd2l0aCBEVlIgc3VwcG9ydCBjbGFzc1xuICovXG5jbGFzcyBEVlJTZWVrQmFyIGV4dGVuZHMgU2Vla0JhciB7XG5cbiAgLyoqIEBjb25zdHJ1Y3RvciAqL1xuICBjb25zdHJ1Y3RvcihwbGF5ZXIsIG9wdGlvbnMpIHtcblxuICAgIHN1cGVyKHBsYXllciwgb3B0aW9ucyk7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShlKSB7XG4gICBsZXQgYnVmZmVyZWRUaW1lLCBuZXdUaW1lO1xuXG4gICAgaWYgKHRoaXMucGxheWVyXy5kdXJhdGlvbigpIDwgdGhpcy5wbGF5ZXJfLmN1cnJlbnRUaW1lKCkpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJfLmR1cmF0aW9uKHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpKTtcbiAgICAgICAgYnVmZmVyZWRUaW1lID0gdGhpcy5wbGF5ZXJfLmN1cnJlbnRUaW1lKCkgLSB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lO1xuICAgICAgICBuZXdUaW1lID0gKHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpIC0gYnVmZmVyZWRUaW1lKSArICh0aGlzLmNhbGN1bGF0ZURpc3RhbmNlKGUpICogYnVmZmVyZWRUaW1lKTsgLy8gb25seSBzZWFyY2ggaW4gYnVmZmVyXG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBidWZmZXJlZFRpbWUgPSB0aGlzLnBsYXllcl8uZHVyYXRpb24oKSAtIHRoaXMub3B0aW9ucy5zdGFydFRpbWU7XG4gICAgICAgIG5ld1RpbWUgPSAodGhpcy5wbGF5ZXJfLmR1cmF0aW9uKCkgLSBidWZmZXJlZFRpbWUpICsgKHRoaXMuY2FsY3VsYXRlRGlzdGFuY2UoZSkgKiBidWZmZXJlZFRpbWUpOyAvLyBvbmx5IHNlYXJjaCBpbiBidWZmZXJcblxuICAgIH1cbiAgICBpZiAobmV3VGltZSA8IHRoaXMub3B0aW9ucy5zdGFydFRpbWUpIHsgLy8gaWYgY2FsY3VsYXRlZCB0aW1lIHdhcyBub3QgcGxheWVkIG9uY2UuXG4gICAgICAgIG5ld1RpbWUgPSB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBsZXQgdmlkZW8gZW5kIHdoaWxlIHNjcnViYmluZy5cbiAgICBpZiAobmV3VGltZSA9PSB0aGlzLnBsYXllcl8uZHVyYXRpb24oKSkge1xuICAgICAgICBuZXdUaW1lID0gbmV3VGltZSAtIDAuMTtcbiAgICB9XG5cbiAgICAvLyBTZXQgbmV3IHRpbWUgKHRlbGwgcGxheWVyIHRvIHNlZWsgdG8gbmV3IHRpbWUpXG4gICAgdGhpcy5wbGF5ZXJfLmN1cnJlbnRUaW1lKG5ld1RpbWUpO1xuICB9XG5cbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgcGxheWVyIGlzIHJlYWR5LlxuICpcbiAqIFRoaXMgaXMgYSBncmVhdCBwbGFjZSBmb3IgeW91ciBwbHVnaW4gdG8gaW5pdGlhbGl6ZSBpdHNlbGYuIFdoZW4gdGhpc1xuICogZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgcGxheWVyIHdpbGwgaGF2ZSBpdHMgRE9NIGFuZCBjaGlsZCBjb21wb25lbnRzXG4gKiBpbiBwbGFjZS5cbiAqXG4gKiBAZnVuY3Rpb24gb25QbGF5ZXJSZWFkeVxuICogQHBhcmFtICAgIHtQbGF5ZXJ9IHBsYXllclxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICovXG5jb25zdCBvblBsYXllclJlYWR5ID0gKHBsYXllciwgb3B0aW9ucykgPT4ge1xuICBwbGF5ZXIuYWRkQ2xhc3MoJ3Zqcy1kdnJzZWVrYmFyJyk7XG4gIHBsYXllci5jb250cm9sQmFyLmFkZENsYXNzKCd2anMtZHZyc2Vla2Jhci1jb250cm9sLWJhcicpO1xuXG4gIGlmIChwbGF5ZXIuY29udHJvbEJhci5wcm9ncmVzc0NvbnRyb2wpIHtcbiAgICBwbGF5ZXIuY29udHJvbEJhci5wcm9ncmVzc0NvbnRyb2wuYWRkQ2xhc3MoJ3Zqcy1kdnJzZWVrYmFyLXByb2dyZXNzLWNvbnRyb2wnKTtcbiAgfVxuXG4gIC8vIEFERCBMaXZlIEJ1dHRvbjpcbiAgbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgIG5ld0xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgYnRuTGl2ZUVsLmNsYXNzTmFtZSA9ICd2anMtbGl2ZS1idXR0b24gdmpzLWNvbnRyb2wnO1xuXG4gIG5ld0xpbmsuaW5uZXJIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndmpzLWxpdmUtZGlzcGxheScpWzBdLmlubmVySFRNTDtcbiAgbmV3TGluay5pZCA9ICdsaXZlQnV0dG9uJztcblxuICBpZiAoIXBsYXllci5wYXVzZWQoKSkge1xuICAgIG5ld0xpbmsuY2xhc3NOYW1lID0gJ2xhYmVsIG9uYWlyJztcbiAgfVxuXG4gIGxldCBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcGxheWVyLnBhdXNlKCk7XG4gICAgcGxheWVyLmN1cnJlbnRUaW1lKDApO1xuICAgIC8vcGxheWVyLmxvYWQoKTtcbiAgICBwbGF5ZXIucGxheSgpO1xuICB9O1xuXG4gIGlmKG5ld0xpbmsuYWRkRXZlbnRMaXN0ZW5lcikgLy8gRE9NIG1ldGhvZFxuICAgIG5ld0xpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIsIGZhbHNlKTtcbiAgZWxzZSBpZihhbmNob3IuYXR0YWNoRXZlbnQpIC8vIHRoaXMgaXMgZm9yIElFLCBiZWNhdXNlIGl0IGRvZXNuJ3Qgc3VwcG9ydCBhZGRFdmVudExpc3RlbmVyXG4gICAgbmV3TGluay5hdHRhY2hFdmVudCgnb25jbGljaycsIGZ1bmN0aW9uKCl7IHJldHVybiBjbGlja0hhbmRsZXIuYXBwbHkobmV3TGluaywgW3dpbmRvdy5ldmVudF0pfSk7XG5cbiAgYnRuTGl2ZUVsLmFwcGVuZENoaWxkKG5ld0xpbmspO1xuXG4gIGxldCBjb250cm9sQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndmpzLWNvbnRyb2wtYmFyJylbMF0sXG4gIGluc2VydEJlZm9yZU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtcHJvZ3Jlc3MtY29udHJvbCcpWzBdO1xuXG4gIGNvbnRyb2xCYXIuaW5zZXJ0QmVmb3JlKGJ0bkxpdmVFbCwgaW5zZXJ0QmVmb3JlTm9kZSk7XG5cbiAgdmlkZW9qcy5sb2coJ2R2clNlZWtiYXIgUGx1Z2luIEVOQUJMRUQhJywgb3B0aW9ucyk7XG59O1xuXG5jb25zdCBvblRpbWVVcGRhdGUgPSAocGxheWVyLCBlKSA9PiB7XG5cbiAgcGxheWVyLmR1cmF0aW9uKHBsYXllci5jdXJyZW50VGltZSgpKTtcbn07XG5cbmNvbnN0IG9uUGxheSA9IChwbGF5ZXIsIGUpID0+IHtcbiAgbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlQnV0dG9uJyk7XG4gIGlmIChidG5MaXZlRWwpIHtcbiAgICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJ2xhYmVsIG9uYWlyJztcbiAgfVxufTtcblxuLyoqXG4gKiBBIHZpZGVvLmpzIHBsdWdpbi5cbiAqXG4gKiBJbiB0aGUgcGx1Z2luIGZ1bmN0aW9uLCB0aGUgdmFsdWUgb2YgYHRoaXNgIGlzIGEgdmlkZW8uanMgYFBsYXllcmBcbiAqIGluc3RhbmNlLiBZb3UgY2Fubm90IHJlbHkgb24gdGhlIHBsYXllciBiZWluZyBpbiBhIFwicmVhZHlcIiBzdGF0ZSBoZXJlLFxuICogZGVwZW5kaW5nIG9uIGhvdyB0aGUgcGx1Z2luIGlzIGludm9rZWQuIFRoaXMgbWF5IG9yIG1heSBub3QgYmUgaW1wb3J0YW50XG4gKiB0byB5b3U7IGlmIG5vdCwgcmVtb3ZlIHRoZSB3YWl0IGZvciBcInJlYWR5XCIhXG4gKlxuICogQGZ1bmN0aW9uIGR2cnNlZWtiYXJcbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3QgZHZyc2Vla2JhciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgY29uc3QgcGxheWVyICA9IHRoaXM7XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzO1xuICB9XG5cbiAgbGV0IGR2clNlZWtCYXIgPSBuZXcgRFZSU2Vla0JhcihwbGF5ZXIsIG9wdGlvbnMpO1xuXG4gIC8vUmVnaXN0ZXIgY3VzdG9tIERWUlNlZWtCYXIgQ29tcG9uZW50OlxuICB2aWRlb2pzLnJlZ2lzdGVyQ29tcG9uZW50KCdEVlJTZWVrQmFyJywgRFZSU2Vla0Jhcik7XG5cbiAgdGhpcy5vbigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgb25UaW1lVXBkYXRlKHRoaXMsIGUpO1xuICB9KTtcblxuICB0aGlzLm9uKCdwbGF5JywgKGUpID0+IHtcbiAgICBvblBsYXkodGhpcywgZSk7XG4gIH0pO1xuXG50aGlzLm9uKCdwYXVzZScsIChlKSA9PiB7XG4gICAgbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlQnV0dG9uJyk7XG5cbiAgICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJyc7XG4gIH0pO1xuXG4gIHRoaXMub24oJ3NlZWtlZCcsIChlKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1NFRUtFRCEnKTtcbiAgfSk7XG5cbiAgdGhpcy5yZWFkeSgoKSA9PiB7XG4gICAgb25QbGF5ZXJSZWFkeSh0aGlzLCB2aWRlb2pzLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbnZpZGVvanMucGx1Z2luKCdkdnJzZWVrYmFyJywgZHZyc2Vla2Jhcik7XG5cbi8vIEluY2x1ZGUgdGhlIHZlcnNpb24gbnVtYmVyLlxuZHZyc2Vla2Jhci5WRVJTSU9OID0gJ19fVkVSU0lPTl9fJztcblxuZXhwb3J0IGRlZmF1bHQgZHZyc2Vla2JhcjtcbiJdfQ==
