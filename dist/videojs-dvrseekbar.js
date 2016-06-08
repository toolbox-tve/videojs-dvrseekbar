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

exports.DVRSeekBar = DVRSeekBar;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _dvrseekbarJs = require('./dvrseekbar.js');

// Default options for the plugin.
var defaults = {
  startTime: 0
};

var SeekBar = _videoJs2['default'].getComponent('SeekBar');

SeekBar.prototype.handleMouseMove = function (e) {
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
  var btnLiveEl = document.createElement('div'),
      newLink = document.createElement('a');

  btnLiveEl.className = 'vjs-live-button vjs-control';

  newLink.innerHTML = document.getElementsByClassName('vjs-live-display')[0].innerHTML;
  newLink.id = 'liveButton';

  if (!player.paused()) {
    newLink.className = 'label onair';
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

  var dvrSeekBar = new _dvrseekbarJs.DVRSeekBar(player, options);

  // Register custom DVRSeekBar Component:
  _videoJs2['default'].registerComponent('DVRSeekBar', dvrSeekBar);

  this.on('timeupdate', function (e) {
    onTimeUpdate(_this, e);
  });

  this.on('play', function (e) {
    var btnLiveEl = document.getElementById('liveButton');

    if (btnLiveEl) {
      btnLiveEl.className = 'label onair';
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
        btnLiveEl.className = 'label';
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
dvrseekbar.VERSION = '0.2.4';

exports['default'] = dvrseekbar;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./dvrseekbar.js":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9EZS9Qcm95ZWN0b3MvVEJYL3ZpZGVvanMtZHZyc2Vla2Jhci9zcmMvZHZyc2Vla2Jhci5qcyIsIi9Wb2x1bWVzL0RlL1Byb3llY3Rvcy9UQlgvdmlkZW9qcy1kdnJzZWVrYmFyL3NyYy9wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkNBb0IsVUFBVTs7OztBQUM5QixJQUFNLE9BQU8sR0FBRyxxQkFBUSxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7Ozs7OztJQUsxQyxVQUFVO2NBQVYsVUFBVTs7OztBQUdILGFBSFAsVUFBVSxDQUdGLE1BQU0sRUFBRSxPQUFPLEVBQUU7OEJBSHpCLFVBQVU7O0FBS1osbUNBTEUsVUFBVSw2Q0FLTixNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztLQUNwQzs7aUJBUEcsVUFBVTs7ZUFTQyx5QkFBQyxDQUFDLEVBQUU7QUFDakIsZ0JBQUksWUFBWSxZQUFBO2dCQUFFLE9BQU8sWUFBQSxDQUFDOztBQUUxQixnQkFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEQsb0JBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNsRCw0QkFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDbkUsdUJBQU8sR0FBRyxBQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsWUFBWSxHQUFLLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FB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QztDQUNKLENBQUM7OztBQUdGLHFCQUFRLE1BQU0sQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7OztBQUd6QyxVQUFVLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQzs7cUJBRXBCLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHZpZGVvanMgZnJvbSAndmlkZW8uanMnO1xuY29uc3QgU2Vla0JhciA9IHZpZGVvanMuZ2V0Q29tcG9uZW50KCdTZWVrQmFyJyk7XG5cbi8qKlxuICogU2Vla0JhciB3aXRoIERWUiBzdXBwb3J0IGNsYXNzXG4gKi9cbmNsYXNzIERWUlNlZWtCYXIgZXh0ZW5kcyBTZWVrQmFyIHtcblxuICAvKiogQGNvbnN0cnVjdG9yICovXG4gIGNvbnN0cnVjdG9yKHBsYXllciwgb3B0aW9ucykge1xuXG4gICAgc3VwZXIocGxheWVyLCBvcHRpb25zKTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lO1xuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlKGUpIHtcbiAgICBsZXQgYnVmZmVyZWRUaW1lLCBuZXdUaW1lO1xuXG4gICAgaWYgKHRoaXMucGxheWVyXy5kdXJhdGlvbigpIDwgdGhpcy5wbGF5ZXJfLmN1cnJlbnRUaW1lKCkpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJfLmR1cmF0aW9uKHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpKTtcbiAgICAgICAgYnVmZmVyZWRUaW1lID0gdGhpcy5wbGF5ZXJfLmN1cnJlbnRUaW1lKCkgLSB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lO1xuICAgICAgICBuZXdUaW1lID0gKHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpIC0gYnVmZmVyZWRUaW1lKSArICh0aGlzLmNhbGN1bGF0ZURpc3RhbmNlKGUpICogYnVmZmVyZWRUaW1lKTsgLy8gb25seSBzZWFyY2ggaW4gYnVmZmVyXG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBidWZmZXJlZFRpbWUgPSB0aGlzLnBsYXllcl8uZHVyYXRpb24oKSAtIHRoaXMub3B0aW9ucy5zdGFydFRpbWU7XG4gICAgICAgIG5ld1RpbWUgPSAodGhpcy5wbGF5ZXJfLmR1cmF0aW9uKCkgLSBidWZmZXJlZFRpbWUpICsgKHRoaXMuY2FsY3VsYXRlRGlzdGFuY2UoZSkgKiBidWZmZXJlZFRpbWUpOyAvLyBvbmx5IHNlYXJjaCBpbiBidWZmZXJcblxuICAgIH1cbiAgICBpZiAobmV3VGltZSA8IHRoaXMub3B0aW9ucy5zdGFydFRpbWUpIHsgLy8gaWYgY2FsY3VsYXRlZCB0aW1lIHdhcyBub3QgcGxheWVkIG9uY2UuXG4gICAgICAgIG5ld1RpbWUgPSB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBsZXQgdmlkZW8gZW5kIHdoaWxlIHNjcnViYmluZy5cbiAgICBpZiAobmV3VGltZSA9PT0gdGhpcy5wbGF5ZXJfLmR1cmF0aW9uKCkpIHtcbiAgICAgICAgbmV3VGltZSA9IG5ld1RpbWUgLSAwLjE7XG4gICAgfVxuXG4gICAgLy8gU2V0IG5ldyB0aW1lICh0ZWxsIHBsYXllciB0byBzZWVrIHRvIG5ldyB0aW1lKVxuICAgIHRoaXMucGxheWVyXy5jdXJyZW50VGltZShuZXdUaW1lKTtcbiAgfVxuXG59XG5cbmV4cG9ydCB7IERWUlNlZWtCYXIgfVxuIiwiaW1wb3J0IHZpZGVvanMgZnJvbSAndmlkZW8uanMnO1xuaW1wb3J0IHsgRFZSU2Vla0JhciB9IGZyb20gJy4vZHZyc2Vla2Jhci5qcyc7XG4vLyBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwbHVnaW4uXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgc3RhcnRUaW1lOiAwXG59O1xuXG5jb25zdCBTZWVrQmFyID0gdmlkZW9qcy5nZXRDb21wb25lbnQoJ1NlZWtCYXInKTtcblxuU2Vla0Jhci5wcm90b3R5cGUuaGFuZGxlTW91c2VNb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgbGV0IGJ1ZmZlcmVkVGltZSwgbmV3VGltZTtcblxuICAgIGlmICh0aGlzLnBsYXllcl8uZHVyYXRpb24oKSA8IHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpKSB7XG4gICAgICAgIHRoaXMucGxheWVyXy5kdXJhdGlvbih0aGlzLnBsYXllcl8uY3VycmVudFRpbWUoKSk7XG4gICAgICAgIGJ1ZmZlcmVkVGltZSA9IHRoaXMucGxheWVyXy5jdXJyZW50VGltZSgpIC0gdGhpcy5vcHRpb25zLnN0YXJ0VGltZTtcbiAgICAgICAgbmV3VGltZSA9ICh0aGlzLnBsYXllcl8uY3VycmVudFRpbWUoKSAtIGJ1ZmZlcmVkVGltZSkgKyAodGhpcy5jYWxjdWxhdGVEaXN0YW5jZShlKSAqIGJ1ZmZlcmVkVGltZSk7IC8vIG9ubHkgc2VhcmNoIGluIGJ1ZmZlclxuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnVmZmVyZWRUaW1lID0gdGhpcy5wbGF5ZXJfLmR1cmF0aW9uKCkgLSB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lO1xuICAgICAgICBuZXdUaW1lID0gKHRoaXMucGxheWVyXy5kdXJhdGlvbigpIC0gYnVmZmVyZWRUaW1lKSArICh0aGlzLmNhbGN1bGF0ZURpc3RhbmNlKGUpICogYnVmZmVyZWRUaW1lKTsgLy8gb25seSBzZWFyY2ggaW4gYnVmZmVyXG5cbiAgICB9XG4gICAgaWYgKG5ld1RpbWUgPCB0aGlzLm9wdGlvbnMuc3RhcnRUaW1lKSB7IC8vIGlmIGNhbGN1bGF0ZWQgdGltZSB3YXMgbm90IHBsYXllZCBvbmNlLlxuICAgICAgICBuZXdUaW1lID0gdGhpcy5vcHRpb25zLnN0YXJ0VGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgbGV0IHZpZGVvIGVuZCB3aGlsZSBzY3J1YmJpbmcuXG4gICAgaWYgKG5ld1RpbWUgPT09IHRoaXMucGxheWVyXy5kdXJhdGlvbigpKSB7XG4gICAgICAgIG5ld1RpbWUgPSBuZXdUaW1lIC0gMC4xO1xuICAgIH1cblxuICAgIC8vIFNldCBuZXcgdGltZSAodGVsbCBwbGF5ZXIgdG8gc2VlayB0byBuZXcgdGltZSlcbiAgICB0aGlzLnBsYXllcl8uY3VycmVudFRpbWUobmV3VGltZSk7XG59O1xuXG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeS5cbiAqXG4gKiBUaGlzIGlzIGEgZ3JlYXQgcGxhY2UgZm9yIHlvdXIgcGx1Z2luIHRvIGluaXRpYWxpemUgaXRzZWxmLiBXaGVuIHRoaXNcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIHBsYXllciB3aWxsIGhhdmUgaXRzIERPTSBhbmQgY2hpbGQgY29tcG9uZW50c1xuICogaW4gcGxhY2UuXG4gKlxuICogQGZ1bmN0aW9uIG9uUGxheWVyUmVhZHlcbiAqIEBwYXJhbSAgICB7UGxheWVyfSBwbGF5ZXJcbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqL1xuY29uc3Qgb25QbGF5ZXJSZWFkeSA9IChwbGF5ZXIsIG9wdGlvbnMpID0+IHtcbiAgcGxheWVyLmFkZENsYXNzKCd2anMtZHZyc2Vla2JhcicpO1xuICBwbGF5ZXIuY29udHJvbEJhci5hZGRDbGFzcygndmpzLWR2cnNlZWtiYXItY29udHJvbC1iYXInKTtcblxuICBpZiAocGxheWVyLmNvbnRyb2xCYXIucHJvZ3Jlc3NDb250cm9sKSB7XG4gICAgcGxheWVyLmNvbnRyb2xCYXIucHJvZ3Jlc3NDb250cm9sLmFkZENsYXNzKCd2anMtZHZyc2Vla2Jhci1wcm9ncmVzcy1jb250cm9sJyk7XG4gIH1cblxuICAvLyBBREQgTGl2ZSBCdXR0b246XG4gIGxldCBidG5MaXZlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICBuZXdMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gIGJ0bkxpdmVFbC5jbGFzc05hbWUgPSAndmpzLWxpdmUtYnV0dG9uIHZqcy1jb250cm9sJztcblxuICBuZXdMaW5rLmlubmVySFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Zqcy1saXZlLWRpc3BsYXknKVswXS5pbm5lckhUTUw7XG4gIG5ld0xpbmsuaWQgPSAnbGl2ZUJ1dHRvbic7XG5cbiAgaWYgKCFwbGF5ZXIucGF1c2VkKCkpIHtcbiAgICBuZXdMaW5rLmNsYXNzTmFtZSA9ICdsYWJlbCBvbmFpcic7XG4gIH1cblxuICAvKlxuICBsZXQgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcGxheWVyLnBhdXNlKCk7XG4gICAgcGxheWVyLmN1cnJlbnRUaW1lKDApO1xuXG4gICAgcGxheWVyLnBsYXkoKTtcbiAgfTtcblxuICBpZiAobmV3TGluay5hZGRFdmVudExpc3RlbmVyKSB7IC8vIERPTSBtZXRob2RcbiAgICBuZXdMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAobmV3TGluay5hdHRhY2hFdmVudCkgeyAvLyB0aGlzIGlzIGZvciBJRSwgYmVjYXVzZSBpdCBkb2Vzbid0IHN1cHBvcnQgYWRkRXZlbnRMaXN0ZW5lclxuICAgIG5ld0xpbmsuYXR0YWNoRXZlbnQoJ29uY2xpY2snLCBmdW5jdGlvbigpIHsgcmV0dXJuIGNsaWNrSGFuZGxlci5hcHBseShuZXdMaW5rLCBbIHdpbmRvdy5ldmVudCBdKTsgfSk7XG4gIH1cbiAgKi9cbiAgYnRuTGl2ZUVsLmFwcGVuZENoaWxkKG5ld0xpbmspO1xuXG4gIGxldCBjb250cm9sQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndmpzLWNvbnRyb2wtYmFyJylbMF0sXG4gIGluc2VydEJlZm9yZU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtcHJvZ3Jlc3MtY29udHJvbCcpWzBdO1xuXG4gIGNvbnRyb2xCYXIuaW5zZXJ0QmVmb3JlKGJ0bkxpdmVFbCwgaW5zZXJ0QmVmb3JlTm9kZSk7XG5cbiAgdmlkZW9qcy5sb2coJ2R2clNlZWtiYXIgUGx1Z2luIEVOQUJMRUQhJywgb3B0aW9ucyk7XG59O1xuXG5jb25zdCBvblRpbWVVcGRhdGUgPSAocGxheWVyLCBlKSA9PiB7XG5cbiAgcGxheWVyLmR1cmF0aW9uKHBsYXllci5jdXJyZW50VGltZSgpKTtcbn07XG5cbi8qKlxuICogQSB2aWRlby5qcyBwbHVnaW4uXG4gKlxuICogSW4gdGhlIHBsdWdpbiBmdW5jdGlvbiwgdGhlIHZhbHVlIG9mIGB0aGlzYCBpcyBhIHZpZGVvLmpzIGBQbGF5ZXJgXG4gKiBpbnN0YW5jZS4gWW91IGNhbm5vdCByZWx5IG9uIHRoZSBwbGF5ZXIgYmVpbmcgaW4gYSBcInJlYWR5XCIgc3RhdGUgaGVyZSxcbiAqIGRlcGVuZGluZyBvbiBob3cgdGhlIHBsdWdpbiBpcyBpbnZva2VkLiBUaGlzIG1heSBvciBtYXkgbm90IGJlIGltcG9ydGFudFxuICogdG8geW91OyBpZiBub3QsIHJlbW92ZSB0aGUgd2FpdCBmb3IgXCJyZWFkeVwiIVxuICpcbiAqIEBmdW5jdGlvbiBkdnJzZWVrYmFyXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKiAgICAgICAgICAgQW4gb2JqZWN0IG9mIG9wdGlvbnMgbGVmdCB0byB0aGUgcGx1Z2luIGF1dGhvciB0byBkZWZpbmUuXG4gKi9cbmNvbnN0IGR2cnNlZWtiYXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGNvbnN0IHBsYXllciA9IHRoaXM7XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzO1xuICB9XG5cbiAgbGV0IGR2clNlZWtCYXIgPSBuZXcgRFZSU2Vla0JhcihwbGF5ZXIsIG9wdGlvbnMpO1xuXG4gIC8vIFJlZ2lzdGVyIGN1c3RvbSBEVlJTZWVrQmFyIENvbXBvbmVudDpcbiAgdmlkZW9qcy5yZWdpc3RlckNvbXBvbmVudCgnRFZSU2Vla0JhcicsIGR2clNlZWtCYXIpO1xuXG4gIHRoaXMub24oJ3RpbWV1cGRhdGUnLCAoZSkgPT4ge1xuICAgIG9uVGltZVVwZGF0ZSh0aGlzLCBlKTtcbiAgfSk7XG5cbiAgdGhpcy5vbigncGxheScsIChlKSA9PiB7XG4gICAgbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlQnV0dG9uJyk7XG5cbiAgICBpZiAoYnRuTGl2ZUVsKSB7XG4gICAgICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJ2xhYmVsIG9uYWlyJztcbiAgICAgIGJ0bkxpdmVFbC5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCJ2anMtY29udHJvbC10ZXh0XCI+U3RyZWFtIFR5cGU8L3NwYW4+TElWRSc7XG4gICAgfVxuICB9KTtcblxuICB0aGlzLm9uKCdwYXVzZScsIChlKSA9PiB7XG4gICAgbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlQnV0dG9uJyk7XG5cbiAgICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJyc7XG4gIH0pO1xuXG4gIHRoaXMub24oJ3NlZWtlZCcsIChlKSA9PiB7XG4gICAgLyogbGV0IGJ0bkxpdmVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlQnV0dG9uJyk7XG5cbiAgICBpZiAocGxheWVyLmR1cmF0aW9uKCkgPCBwbGF5ZXIuY3VycmVudFRpbWUoKSkge1xuICAgICAgICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJ2xhYmVsJztcbiAgICAgICAgYnRuTGl2ZUVsLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cInZqcy1jb250cm9sLXRleHRcIj5TdHJlYW0gVHlwZTwvc3Bhbj5EVlInO1xuICAgIH0gKi9cbiAgfSk7XG5cbiAgdGhpcy5yZWFkeSgoKSA9PiB7XG4gICAgb25QbGF5ZXJSZWFkeSh0aGlzLCB2aWRlb2pzLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbnZpZGVvanMucGx1Z2luKCdkdnJzZWVrYmFyJywgZHZyc2Vla2Jhcik7XG5cbi8vIEluY2x1ZGUgdGhlIHZlcnNpb24gbnVtYmVyLlxuZHZyc2Vla2Jhci5WRVJTSU9OID0gJ19fVkVSU0lPTl9fJztcblxuZXhwb3J0IGRlZmF1bHQgZHZyc2Vla2JhcjtcbiJdfQ==
