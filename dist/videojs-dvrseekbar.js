(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsDvrseekbar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
'use strict';
/**
 * @file DVRSeekBar.js
 * @module DVRSeekBar
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var Component = _videoJs2['default'].getComponent('Component');

/**
 * VideoJS component class
 * @class DVRSeekBar
 */

var DVRSeekBar = (function (_Component) {
  _inherits(DVRSeekBar, _Component);

  /**
  * Create an instance of this class
  *
  * @param {Player} player
  *        The `Player` that this class should be attached to.
  *
  * @param {Object} [options]
  *        The key/value store of player options.
  */

  function DVRSeekBar(player, options) {
    _classCallCheck(this, DVRSeekBar);

    if (!options) {
      options = {};
    }

    _get(Object.getPrototypeOf(DVRSeekBar.prototype), 'constructor', this).call(this, player, options);

    this.video_ = player.tech_.el_;

    this.isSeeking = false;
    this.seekTimeout_ = null;

    this.on('blur', this.handleBlur);
    this.on('click', this.handleClick);
    this.on('focus', this.handleFocus);
    this.on('input', this.handleSeekInput);
    this.on('mousedown', this.handleSeekStart);
    this.el_.addEventListener('touchstart', this.handleSeekStart.bind(this), { passive: true });
    this.on('mouseup', this.handleSeekEnd);
    this.on('touchend', this.handleSeekEnd);

    if (player.dash) {

      if (player.dash.shakaPlayer) {
        this.sourceHandler_ = player.dash.shakaPlayer;
        this.sourceHandler_.addEventListener('buffering', this.onBufferingStateChange_.bind(this));
        _globalWindow2['default'].setInterval(this.updateTimeAndSeekRange_.bind(this), 125);
      }

      if (player.dash.mediaPlayer) {
        this.sourceHandler_ = player.dash.mediaPlayer;
      }
    }
  }

  /**
  * Create the `Component`'s DOM element
  *
  * @return {Element}
  *         The element that was created.
  */

  _createClass(DVRSeekBar, [{
    key: 'createEl',
    value: function createEl() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      props.className = 'vjs-progress-holder';
      props = Object.assign({
        tabIndex: 0
      }, props);

      attributes = Object.assign({
        max: 1,
        min: 0,
        step: 'any',
        tabIndex: 0,
        type: 'range',
        value: 0
      }, attributes);

      return _get(Object.getPrototypeOf(DVRSeekBar.prototype), 'createEl', this).call(this, 'input', props, attributes);
    }

    // EVENT HANDLERS:

    /**
     * Handle a `blur` event on this `Slider`.
     *
     * @param {EventTarget~Event} event
     *        The `blur` event that caused this function to run.
     *
     * @listens blur
     */
  }, {
    key: 'handleBlur',
    value: function handleBlur(e) {
      this.off(this.el_.ownerDocument, 'keydown', this.handleKeyPress);
    }

    /**
     * Listener for click events on slider, used to prevent clicks
     *   from bubbling up to parent elements like button menus.
     *
     * @param {Object} event
     *        Event that caused this object to run
     */
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }

    /**
     * Handle a `focus` event on this `Slider`.
     *
     * @param {EventTarget~Event} e
     *        The `focus` event that caused this function to run.
     *
     * @listens focus
     * @memberOf DVRSeekBar
     */
  }, {
    key: 'handleFocus',
    value: function handleFocus(e) {
      this.on(this.el_.ownerDocument, 'keydown', this.handleKeyPress);
    }

    /**
     * Handle a `keydown` event on the `Slider`. Watches for left, rigth, up, and down
     * arrow keys. This function will only be called when the slider has focus. See
     * {@link Slider#handleFocus} and {@link Slider#handleBlur}.
     *
     * @param {EventTarget~Event} e
     *        the `keydown` event that caused this function to run.
     *
     * @listens keydown
     */
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(e) {
      // Left and Down Arrows
      if (e.which === 37 || e.which === 40) {
        e.preventDefault();
        this.stepBack();

        // Up and Right Arrows
      } else if (e.which === 38 || e.which === 39) {
          e.preventDefault();
          this.stepForward();
        }
    }

    /**
     * Handle `input` event on seek in the bar.
     * 
     * @listens input 
     * @memberof DVRSeekBar
     */
  }, {
    key: 'handleSeekInput',
    value: function handleSeekInput() {

      if (!this.video_.duration) {
        // Can't seek yet. Ignore.
        return;
      }

      // Update the UI right away.
      //this.updateTimeAndSeekRange_();

      // Collect input events and seek when things have been stable for 125ms.
      if (this.seekTimeout_ !== null) {
        _globalWindow2['default'].clearTimeout(this.seekTimeout_);
      }

      this.seekTimeout_ = _globalWindow2['default'].setTimeout(this.handleSeekInputTimeout(), 125);
    }

    /**
     * When slider input timeout
     * 
     * @memberof DVRSeekBar
     */
  }, {
    key: 'handleSeekInputTimeout',
    value: function handleSeekInputTimeout() {

      this.seekTimeout_ = null;
      this.video_.currentTime = parseFloat(this.el_.value);
    }

    /**
     * Handle the mouse down and touch start events
     * 
     * @param {EventTarget~Event} e 
     * @listens mousedown
     * @listens touchstart 
     * @memberof DVRSeekBar
     */
  }, {
    key: 'handleSeekStart',
    value: function handleSeekStart(e) {

      this.isSeeking = true;
      this.video_.pause();
    }

    /**
     * Handle the mouse up and touch end events
     * 
     * @param {EventTarget~Event} e 
     * @listens mouseup
     * @listens touchend
     * @memberof DVRSeekBar
     */
  }, {
    key: 'handleSeekEnd',
    value: function handleSeekEnd(e) {

      if (this.seekTimeout_ != null) {
        // They just let go of the seek bar, so end the timer early.
        _globalWindow2['default'].clearTimeout(this.seekTimeout_);
        this.handleSeekInputTimeout();
      }

      this.isSeeking = false;
      this.video_.play();
    }
  }]);

  return DVRSeekBar;
})(Component);

exports['default'] = DVRSeekBar;

//////////////////////////
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"global/window":1}],3:[function(require,module,exports){
(function (global){
'use strict';
/**
 * @file plugin.js
 * @module dvrseekbarPlugin
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _DVRSeekBar = require('./DVRSeekBar');

var _DVRSeekBar2 = _interopRequireDefault(_DVRSeekBar);

_videoJs2['default'].registerComponent('DVRseekBar', _DVRSeekBar2['default']);

// Default options for the plugin.
var defaults = {
  startTime: 0,
  disableDVRslider: false
};

var VALID_OPTIONS = {
  startTime: 'number',
  disableDVRslider: 'boolean'
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
var dvrseekbarPlugin = function dvrseekbarPlugin(options) {
  var _this = this;

  // If explicity set options to false disable plugin:
  if (typeof options === 'boolean' && options === false) {
    return;
  }

  if (!options || options === {}) {
    options = defaults;
  }

  // Check if options are valid:
  var props = Object.keys(options);
  for (var i = 0, len = props.length; i < len; i++) {
    var key = props[i];

    if (!VALID_OPTIONS.hasOwnProperty(key)) {
      console.warn('${key} option is not a valid property, ignored.');
      delete options[key];
    } else {

      if (typeof options[key] !== VALID_OPTIONS[key]) {
        console.warn('${key} option value must be ${VALID_OPTIONS[key]}, ignored.');
        delete options[key];
      }
    }
  }

  if (options.disableDVRslider) {
    this.controlBar.removeChild('progressControl');
    this.controlBar.removeChild('timeDivider');
    this.controlBar.removeChild('durationDisplay');

    return;
  }

  this.one('durationchange', function (e) {
    var IS_LIVE_STREAM = _this.duration() > 1e+300;

    if (IS_LIVE_STREAM) {
      _this.controlBar.removeChild('progressControl');
      _this.controlBar.removeChild('timeDivider');
      _this.controlBar.removeChild('durationDisplay');

      _this.controlBar.liveDisplay.addChild('DVRseekBar');
    } else {
      if (_this.controlBar.liveDisplay.getChild('DVRseekBar') !== undefined) {
        _this.controlBar.liveDisplay.removeChild('DVRseekBar');

        _this.controlBar.addChild('timeDivider');
        _this.controlBar.addChild('durationDisplay');
        _this.controlBar.addChild('progressControl');
      }
    }
  });
};

// Include the version number.
dvrseekbarPlugin.VERSION = '0.2.6';

// Register the plugin with video.js.
// Updated for video.js 6 - https://github.com/videojs/video.js/wiki/Video.js-6-Migration-Guide
var registerPlugin = _videoJs2['default'].registerPlugin || _videoJs2['default'].plugin;

registerPlugin('dvrseekbar', dvrseekbarPlugin);
exports['default'] = dvrseekbarPlugin;

////////////////////////////////
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./DVRSeekBar":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIi9Vc2Vycy9kYXZpZGxxL1RCWC92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL0RWUlNlZWtCYXIuanMiLCIvVXNlcnMvZGF2aWRscS9UQlgvdmlkZW9qcy1kdnJzZWVrYmFyL3NyYy9wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNiQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBS08sVUFBVTs7Ozs0QkFDWCxlQUFlOzs7O0FBRWxDLElBQU0sU0FBUyxHQUFHLHFCQUFRLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7OztJQU05QyxVQUFVO1lBQVYsVUFBVTs7Ozs7Ozs7Ozs7O0FBV0gsV0FYUCxVQUFVLENBV0YsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFYekIsVUFBVTs7QUFhWixRQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1YsYUFBTyxHQUFHLEVBQUUsQ0FBQztLQUNoQjs7QUFFRCwrQkFqQkUsVUFBVSw2Q0FpQk4sTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFP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LENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM1QyxjQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztPQUM3QztLQUNGO0dBQ0YsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7O0FBR0YsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQzs7OztBQUl6QyxJQUFNLGNBQWMsR0FBRyxxQkFBUSxjQUFjLElBQUkscUJBQVEsTUFBTSxDQUFDOztBQUVoRSxjQUFjLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7cUJBQ2hDLGdCQUFnQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgd2luO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbiA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbiA9IGdsb2JhbDtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgIHdpbiA9IHNlbGY7XG59IGVsc2Uge1xuICAgIHdpbiA9IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQGZpbGUgRFZSU2Vla0Jhci5qc1xuICogQG1vZHVsZSBEVlJTZWVrQmFyXG4gKi9cbmltcG9ydCB2aWRlb2pzIGZyb20gJ3ZpZGVvLmpzJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmNvbnN0IENvbXBvbmVudCA9IHZpZGVvanMuZ2V0Q29tcG9uZW50KCdDb21wb25lbnQnKTtcblxuLyoqXG4gKiBWaWRlb0pTIGNvbXBvbmVudCBjbGFzc1xuICogQGNsYXNzIERWUlNlZWtCYXJcbiAqL1xuY2xhc3MgRFZSU2Vla0JhciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3NcbiAgKlxuICAqIEBwYXJhbSB7UGxheWVyfSBwbGF5ZXJcbiAgKiAgICAgICAgVGhlIGBQbGF5ZXJgIHRoYXQgdGhpcyBjbGFzcyBzaG91bGQgYmUgYXR0YWNoZWQgdG8uXG4gICpcbiAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICogICAgICAgIFRoZSBrZXkvdmFsdWUgc3RvcmUgb2YgcGxheWVyIG9wdGlvbnMuXG4gICovXG4gIGNvbnN0cnVjdG9yKHBsYXllciwgb3B0aW9ucykge1xuXG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBzdXBlcihwbGF5ZXIsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy52aWRlb18gPSBwbGF5ZXIudGVjaF8uZWxfO1xuXG4gICAgdGhpcy5pc1NlZWtpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnNlZWtUaW1lb3V0XyA9IG51bGw7XG5cbiAgICB0aGlzLm9uKCdibHVyJywgdGhpcy5oYW5kbGVCbHVyKTtcbiAgICB0aGlzLm9uKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICAgIHRoaXMub24oJ2ZvY3VzJywgdGhpcy5oYW5kbGVGb2N1cyk7XG4gICAgdGhpcy5vbignaW5wdXQnLCB0aGlzLmhhbmRsZVNlZWtJbnB1dCk7XG4gICAgdGhpcy5vbignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVTZWVrU3RhcnQpO1xuICAgIHRoaXMuZWxfLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAndG91Y2hzdGFydCcsIFxuICAgICAgdGhpcy5oYW5kbGVTZWVrU3RhcnQuYmluZCh0aGlzKSwgXG4gICAgICB7IHBhc3NpdmU6IHRydWUgfVxuICAgICk7XG4gICAgdGhpcy5vbignbW91c2V1cCcsIHRoaXMuaGFuZGxlU2Vla0VuZCk7XG4gICAgdGhpcy5vbigndG91Y2hlbmQnLCB0aGlzLmhhbmRsZVNlZWtFbmQpO1xuXG4gICAgaWYgKHBsYXllci5kYXNoKSB7XG5cbiAgICAgIGlmIChwbGF5ZXIuZGFzaC5zaGFrYVBsYXllcikge1xuICAgICAgICB0aGlzLnNvdXJjZUhhbmRsZXJfID0gcGxheWVyLmRhc2guc2hha2FQbGF5ZXI7XG4gICAgICAgIHRoaXMuc291cmNlSGFuZGxlcl8uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICdidWZmZXJpbmcnLCB0aGlzLm9uQnVmZmVyaW5nU3RhdGVDaGFuZ2VfLmJpbmQodGhpcykpO1xuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy51cGRhdGVUaW1lQW5kU2Vla1JhbmdlXy5iaW5kKHRoaXMpLCAxMjUpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGxheWVyLmRhc2gubWVkaWFQbGF5ZXIpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VIYW5kbGVyXyA9IHBsYXllci5kYXNoLm1lZGlhUGxheWVyO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgfVxuXG5cbiAgLyoqXG4gICogQ3JlYXRlIHRoZSBgQ29tcG9uZW50YCdzIERPTSBlbGVtZW50XG4gICpcbiAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAqICAgICAgICAgVGhlIGVsZW1lbnQgdGhhdCB3YXMgY3JlYXRlZC5cbiAgKi9cbiAgY3JlYXRlRWwocHJvcHM9e30sIGF0dHJpYnV0ZXM9e30pIHtcblxuICAgIHByb3BzLmNsYXNzTmFtZSA9ICd2anMtcHJvZ3Jlc3MtaG9sZGVyJztcbiAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdGFiSW5kZXg6IDBcbiAgICB9LCBwcm9wcyk7XG5cbiAgICBhdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBtYXg6IDEsXG4gICAgICBtaW46IDAsXG4gICAgICBzdGVwOiAnYW55JyxcbiAgICAgIHRhYkluZGV4OiAwLFxuICAgICAgdHlwZTogJ3JhbmdlJyxcbiAgICAgIHZhbHVlOiAwXG4gICAgfSwgYXR0cmlidXRlcyk7XG5cbiAgICByZXR1cm4gc3VwZXIuY3JlYXRlRWwoJ2lucHV0JywgcHJvcHMsIGF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgLy8gRVZFTlQgSEFORExFUlM6XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhIGBibHVyYCBldmVudCBvbiB0aGlzIGBTbGlkZXJgLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fkV2ZW50fSBldmVudFxuICAgKiAgICAgICAgVGhlIGBibHVyYCBldmVudCB0aGF0IGNhdXNlZCB0aGlzIGZ1bmN0aW9uIHRvIHJ1bi5cbiAgICpcbiAgICogQGxpc3RlbnMgYmx1clxuICAgKi9cbiAgaGFuZGxlQmx1cihlKSB7XG4gICAgdGhpcy5vZmYodGhpcy5lbF8ub3duZXJEb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleVByZXNzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgY2xpY2sgZXZlbnRzIG9uIHNsaWRlciwgdXNlZCB0byBwcmV2ZW50IGNsaWNrc1xuICAgKiAgIGZyb20gYnViYmxpbmcgdXAgdG8gcGFyZW50IGVsZW1lbnRzIGxpa2UgYnV0dG9uIG1lbnVzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAgICogICAgICAgIEV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgb2JqZWN0IHRvIHJ1blxuICAgKi9cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhIGBmb2N1c2AgZXZlbnQgb24gdGhpcyBgU2xpZGVyYC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH5FdmVudH0gZVxuICAgKiAgICAgICAgVGhlIGBmb2N1c2AgZXZlbnQgdGhhdCBjYXVzZWQgdGhpcyBmdW5jdGlvbiB0byBydW4uXG4gICAqXG4gICAqIEBsaXN0ZW5zIGZvY3VzXG4gICAqIEBtZW1iZXJPZiBEVlJTZWVrQmFyXG4gICAqL1xuICBoYW5kbGVGb2N1cyhlKSB7XG4gICB0aGlzLm9uKHRoaXMuZWxfLm93bmVyRG9jdW1lbnQsICdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlQcmVzcyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYSBga2V5ZG93bmAgZXZlbnQgb24gdGhlIGBTbGlkZXJgLiBXYXRjaGVzIGZvciBsZWZ0LCByaWd0aCwgdXAsIGFuZCBkb3duXG4gICAqIGFycm93IGtleXMuIFRoaXMgZnVuY3Rpb24gd2lsbCBvbmx5IGJlIGNhbGxlZCB3aGVuIHRoZSBzbGlkZXIgaGFzIGZvY3VzLiBTZWVcbiAgICoge0BsaW5rIFNsaWRlciNoYW5kbGVGb2N1c30gYW5kIHtAbGluayBTbGlkZXIjaGFuZGxlQmx1cn0uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR+RXZlbnR9IGVcbiAgICogICAgICAgIHRoZSBga2V5ZG93bmAgZXZlbnQgdGhhdCBjYXVzZWQgdGhpcyBmdW5jdGlvbiB0byBydW4uXG4gICAqXG4gICAqIEBsaXN0ZW5zIGtleWRvd25cbiAgICovXG4gIGhhbmRsZUtleVByZXNzKGUpIHtcbiAgICAvLyBMZWZ0IGFuZCBEb3duIEFycm93c1xuICAgIGlmIChlLndoaWNoID09PSAzNyB8fCBlLndoaWNoID09PSA0MCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5zdGVwQmFjaygpO1xuXG4gICAgLy8gVXAgYW5kIFJpZ2h0IEFycm93c1xuICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PT0gMzggfHwgZS53aGljaCA9PT0gMzkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuc3RlcEZvcndhcmQoKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYGlucHV0YCBldmVudCBvbiBzZWVrIGluIHRoZSBiYXIuXG4gICAqIFxuICAgKiBAbGlzdGVucyBpbnB1dCBcbiAgICogQG1lbWJlcm9mIERWUlNlZWtCYXJcbiAgICovXG4gIGhhbmRsZVNlZWtJbnB1dCgpIHtcbiAgXG4gICAgaWYgKCF0aGlzLnZpZGVvXy5kdXJhdGlvbikge1xuICAgICAgLy8gQ2FuJ3Qgc2VlayB5ZXQuIElnbm9yZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIFxuICAgIC8vIFVwZGF0ZSB0aGUgVUkgcmlnaHQgYXdheS5cbiAgICAvL3RoaXMudXBkYXRlVGltZUFuZFNlZWtSYW5nZV8oKTtcblxuICAgIC8vIENvbGxlY3QgaW5wdXQgZXZlbnRzIGFuZCBzZWVrIHdoZW4gdGhpbmdzIGhhdmUgYmVlbiBzdGFibGUgZm9yIDEyNW1zLlxuICAgIGlmICh0aGlzLnNlZWtUaW1lb3V0XyAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnNlZWtUaW1lb3V0Xyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWVrVGltZW91dF8gPSB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmhhbmRsZVNlZWtJbnB1dFRpbWVvdXQoKSwgMTI1KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIHNsaWRlciBpbnB1dCB0aW1lb3V0XG4gICAqIFxuICAgKiBAbWVtYmVyb2YgRFZSU2Vla0JhclxuICAgKi9cbiAgaGFuZGxlU2Vla0lucHV0VGltZW91dCgpIHtcblxuICAgIHRoaXMuc2Vla1RpbWVvdXRfID0gbnVsbDtcbiAgICB0aGlzLnZpZGVvXy5jdXJyZW50VGltZSA9IHBhcnNlRmxvYXQodGhpcy5lbF8udmFsdWUpO1xuICB9XG5cblxuICAvKipcbiAgICogSGFuZGxlIHRoZSBtb3VzZSBkb3duIGFuZCB0b3VjaCBzdGFydCBldmVudHNcbiAgICogXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR+RXZlbnR9IGUgXG4gICAqIEBsaXN0ZW5zIG1vdXNlZG93blxuICAgKiBAbGlzdGVucyB0b3VjaHN0YXJ0IFxuICAgKiBAbWVtYmVyb2YgRFZSU2Vla0JhclxuICAgKi9cbiAgaGFuZGxlU2Vla1N0YXJ0KGUpIHtcblxuICAgIHRoaXMuaXNTZWVraW5nID0gdHJ1ZTtcbiAgICB0aGlzLnZpZGVvXy5wYXVzZSgpO1xuICB9XG5cblxuICAvKipcbiAgICogSGFuZGxlIHRoZSBtb3VzZSB1cCBhbmQgdG91Y2ggZW5kIGV2ZW50c1xuICAgKiBcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH5FdmVudH0gZSBcbiAgICogQGxpc3RlbnMgbW91c2V1cFxuICAgKiBAbGlzdGVucyB0b3VjaGVuZFxuICAgKiBAbWVtYmVyb2YgRFZSU2Vla0JhclxuICAgKi9cbiAgaGFuZGxlU2Vla0VuZChlKSB7XG5cbiAgICBpZiAodGhpcy5zZWVrVGltZW91dF8gIT0gbnVsbCkge1xuICAgICAgLy8gVGhleSBqdXN0IGxldCBnbyBvZiB0aGUgc2VlayBiYXIsIHNvIGVuZCB0aGUgdGltZXIgZWFybHkuXG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuc2Vla1RpbWVvdXRfKTtcbiAgICAgIHRoaXMuaGFuZGxlU2Vla0lucHV0VGltZW91dCgpO1xuICAgIH1cblxuICAgIHRoaXMuaXNTZWVraW5nID0gZmFsc2U7XG4gICAgdGhpcy52aWRlb18ucGxheSgpO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRFZSU2Vla0Jhcjtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEBmaWxlIHBsdWdpbi5qc1xuICogQG1vZHVsZSBkdnJzZWVrYmFyUGx1Z2luXG4gKi9cbmltcG9ydCB2aWRlb2pzIGZyb20gJ3ZpZGVvLmpzJztcbmltcG9ydCBEVlJzZWVrQmFyIGZyb20gJy4vRFZSU2Vla0Jhcic7XG5cbnZpZGVvanMucmVnaXN0ZXJDb21wb25lbnQoJ0RWUnNlZWtCYXInLCBEVlJzZWVrQmFyKTtcblxuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHN0YXJ0VGltZTogMCxcbiAgZGlzYWJsZURWUnNsaWRlcjogZmFsc2Vcbn07XG5cbmNvbnN0IFZBTElEX09QVElPTlMgPSB7XG4gIHN0YXJ0VGltZTogJ251bWJlcicsXG4gIGRpc2FibGVEVlJzbGlkZXI6ICdib29sZWFuJ1xufTtcblxuLyoqXG4gKiBBIHZpZGVvLmpzIHBsdWdpbi5cbiAqXG4gKiBJbiB0aGUgcGx1Z2luIGZ1bmN0aW9uLCB0aGUgdmFsdWUgb2YgYHRoaXNgIGlzIGEgdmlkZW8uanMgYFBsYXllcmBcbiAqIGluc3RhbmNlLiBZb3UgY2Fubm90IHJlbHkgb24gdGhlIHBsYXllciBiZWluZyBpbiBhIFwicmVhZHlcIiBzdGF0ZSBoZXJlLFxuICogZGVwZW5kaW5nIG9uIGhvdyB0aGUgcGx1Z2luIGlzIGludm9rZWQuIFRoaXMgbWF5IG9yIG1heSBub3QgYmUgaW1wb3J0YW50XG4gKiB0byB5b3U7IGlmIG5vdCwgcmVtb3ZlIHRoZSB3YWl0IGZvciBcInJlYWR5XCIhXG4gKlxuICogQGZ1bmN0aW9uIGR2cnNlZWtiYXJQbHVnaW5cbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3QgZHZyc2Vla2JhclBsdWdpbiA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAvLyBJZiBleHBsaWNpdHkgc2V0IG9wdGlvbnMgdG8gZmFsc2UgZGlzYWJsZSBwbHVnaW46XG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT09ICdib29sZWFuJyAmJiBvcHRpb25zID09PSBmYWxzZSApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucyA9PT0ge30pIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdHM7XG4gIH1cblxuICAvLyBDaGVjayBpZiBvcHRpb25zIGFyZSB2YWxpZDpcbiAgbGV0IHByb3BzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBwcm9wcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGxldCBrZXkgPSBwcm9wc1tpXTtcblxuICAgIGlmICghVkFMSURfT1BUSU9OUy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJyR7a2V5fSBvcHRpb24gaXMgbm90IGEgdmFsaWQgcHJvcGVydHksIGlnbm9yZWQuJyk7XG4gICAgICBkZWxldGUgb3B0aW9uc1trZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICBcbiAgICAgIGlmICh0eXBlb2Yob3B0aW9uc1trZXldKSAhPT0gVkFMSURfT1BUSU9OU1trZXldKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignJHtrZXl9IG9wdGlvbiB2YWx1ZSBtdXN0IGJlICR7VkFMSURfT1BUSU9OU1trZXldfSwgaWdub3JlZC4nKTtcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMgW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBpZiAob3B0aW9ucy5kaXNhYmxlRFZSc2xpZGVyKSB7XG4gICAgdGhpcy5jb250cm9sQmFyLnJlbW92ZUNoaWxkKCdwcm9ncmVzc0NvbnRyb2wnKTtcbiAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgdGhpcy5jb250cm9sQmFyLnJlbW92ZUNoaWxkKCdkdXJhdGlvbkRpc3BsYXknKTtcbiAgICBcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLm9uZSgnZHVyYXRpb25jaGFuZ2UnLCAoZSkgPT4ge1xuICAgIGNvbnN0IElTX0xJVkVfU1RSRUFNID0gdGhpcy5kdXJhdGlvbigpID4gMWUrMzAwO1xuXG4gICAgaWYgKElTX0xJVkVfU1RSRUFNKSB7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ3Byb2dyZXNzQ29udHJvbCcpO1xuICAgICAgdGhpcy5jb250cm9sQmFyLnJlbW92ZUNoaWxkKCd0aW1lRGl2aWRlcicpO1xuICAgICAgdGhpcy5jb250cm9sQmFyLnJlbW92ZUNoaWxkKCdkdXJhdGlvbkRpc3BsYXknKTtcblxuICAgICAgdGhpcy5jb250cm9sQmFyLmxpdmVEaXNwbGF5LmFkZENoaWxkKCdEVlJzZWVrQmFyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuY29udHJvbEJhci5saXZlRGlzcGxheS5nZXRDaGlsZCgnRFZSc2Vla0JhcicpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5jb250cm9sQmFyLmxpdmVEaXNwbGF5LnJlbW92ZUNoaWxkKCdEVlJzZWVrQmFyJyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sQmFyLmFkZENoaWxkKCd0aW1lRGl2aWRlcicpO1xuICAgICAgICB0aGlzLmNvbnRyb2xCYXIuYWRkQ2hpbGQoJ2R1cmF0aW9uRGlzcGxheScpO1xuICAgICAgICB0aGlzLmNvbnRyb2xCYXIuYWRkQ2hpbGQoJ3Byb2dyZXNzQ29udHJvbCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG4vLyBJbmNsdWRlIHRoZSB2ZXJzaW9uIG51bWJlci5cbmR2cnNlZWtiYXJQbHVnaW4uVkVSU0lPTiA9ICdfX1ZFUlNJT05fXyc7XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbi8vIFVwZGF0ZWQgZm9yIHZpZGVvLmpzIDYgLSBodHRwczovL2dpdGh1Yi5jb20vdmlkZW9qcy92aWRlby5qcy93aWtpL1ZpZGVvLmpzLTYtTWlncmF0aW9uLUd1aWRlXG5jb25zdCByZWdpc3RlclBsdWdpbiA9IHZpZGVvanMucmVnaXN0ZXJQbHVnaW4gfHwgdmlkZW9qcy5wbHVnaW47XG5cbnJlZ2lzdGVyUGx1Z2luKCdkdnJzZWVrYmFyJywgZHZyc2Vla2JhclBsdWdpbik7XG5leHBvcnQgZGVmYXVsdCBkdnJzZWVrYmFyUGx1Z2luO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiJdfQ==
