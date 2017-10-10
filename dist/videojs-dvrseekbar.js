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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsIi9Vc2Vycy9kYXZpZGxxL1RCWC92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL0RWUlNlZWtCYXIuanMiLCIvVXNlcnMvZGF2aWRscS9UQlgvdmlkZW9qcy1kdnJzZWVrYmFyL3NyYy9wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNiQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBS08sVUFBVTs7Ozs0QkFDWCxlQUFlOzs7O0FBRWxDLElBQU0sU0FBUyxHQUFHLHFCQUFRLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7OztJQU05QyxVQUFVO1lBQVYsVUFBVTs7Ozs7Ozs7Ozs7O0FBV0gsV0FYUCxVQUFVLENBV0YsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFYekIsVUFBVTs7QUFhWixRQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1YsYUFBTyxHQUFHLEVBQUUsQ0FBQztLQUNoQjs7QUFFRCwrQkFqQkUsVUFBVSw2Q0FpQk4sTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFP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QU0sY0FBYyxHQUFHLE1BQUssUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDOztBQUVoRCxRQUFJLGNBQWMsRUFBRTtBQUNsQixZQUFLLFVBQVUsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvQyxZQUFLLFVBQVUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0MsWUFBSyxVQUFVLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRS9DLFlBQUssVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDcEQsTUFBTTtBQUNMLFVBQUcsTUFBSyxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDbkUsY0FBSyxVQUFVLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdEQsY0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3hDLGNBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVDLGNBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO09BQzdDO0tBQ0Y7R0FDRixDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFHRixnQkFBZ0IsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDOzs7O0FBSXpDLElBQU0sY0FBYyxHQUFHLHFCQUFRLGNBQWMsSUFBSSxxQkFBUSxNQUFNLENBQUM7O0FBRWhFLGNBQWMsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztxQkFDaEMsZ0JBQWdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB3aW47XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgd2luID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgd2luID0ge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2luO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAZmlsZSBEVlJTZWVrQmFyLmpzXG4gKiBAbW9kdWxlIERWUlNlZWtCYXJcbiAqL1xuaW1wb3J0IHZpZGVvanMgZnJvbSAndmlkZW8uanMnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuY29uc3QgQ29tcG9uZW50ID0gdmlkZW9qcy5nZXRDb21wb25lbnQoJ0NvbXBvbmVudCcpO1xuXG4vKipcbiAqIFZpZGVvSlMgY29tcG9uZW50IGNsYXNzXG4gKiBAY2xhc3MgRFZSU2Vla0JhclxuICovXG5jbGFzcyBEVlJTZWVrQmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAvKipcbiAgKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzc1xuICAqXG4gICogQHBhcmFtIHtQbGF5ZXJ9IHBsYXllclxuICAqICAgICAgICBUaGUgYFBsYXllcmAgdGhhdCB0aGlzIGNsYXNzIHNob3VsZCBiZSBhdHRhY2hlZCB0by5cbiAgKlxuICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgKiAgICAgICAgVGhlIGtleS92YWx1ZSBzdG9yZSBvZiBwbGF5ZXIgb3B0aW9ucy5cbiAgKi9cbiAgY29uc3RydWN0b3IocGxheWVyLCBvcHRpb25zKSB7XG5cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHN1cGVyKHBsYXllciwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnZpZGVvXyA9IHBsYXllci50ZWNoXy5lbF87XG5cbiAgICB0aGlzLmlzU2Vla2luZyA9IGZhbHNlO1xuICAgIHRoaXMuc2Vla1RpbWVvdXRfID0gbnVsbDtcblxuICAgIHRoaXMub24oJ2JsdXInLCB0aGlzLmhhbmRsZUJsdXIpO1xuICAgIHRoaXMub24oJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljayk7XG4gICAgdGhpcy5vbignZm9jdXMnLCB0aGlzLmhhbmRsZUZvY3VzKTtcbiAgICB0aGlzLm9uKCdpbnB1dCcsIHRoaXMuaGFuZGxlU2Vla0lucHV0KTtcbiAgICB0aGlzLm9uKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZVNlZWtTdGFydCk7XG4gICAgdGhpcy5lbF8uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICd0b3VjaHN0YXJ0JywgXG4gICAgICB0aGlzLmhhbmRsZVNlZWtTdGFydC5iaW5kKHRoaXMpLCBcbiAgICAgIHsgcGFzc2l2ZTogdHJ1ZSB9XG4gICAgKTtcbiAgICB0aGlzLm9uKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVTZWVrRW5kKTtcbiAgICB0aGlzLm9uKCd0b3VjaGVuZCcsIHRoaXMuaGFuZGxlU2Vla0VuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENyZWF0ZSB0aGUgYENvbXBvbmVudGAncyBET00gZWxlbWVudFxuICAqXG4gICogQHJldHVybiB7RWxlbWVudH1cbiAgKiAgICAgICAgIFRoZSBlbGVtZW50IHRoYXQgd2FzIGNyZWF0ZWQuXG4gICovXG4gIGNyZWF0ZUVsKHByb3BzPXt9LCBhdHRyaWJ1dGVzPXt9KSB7XG5cbiAgICBwcm9wcy5jbGFzc05hbWUgPSAndmpzLXByb2dyZXNzLWhvbGRlcic7XG4gICAgcHJvcHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHRhYkluZGV4OiAwXG4gICAgfSwgcHJvcHMpO1xuXG4gICAgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgbWF4OiAxLFxuICAgICAgbWluOiAwLFxuICAgICAgc3RlcDogJ2FueScsXG4gICAgICB0YWJJbmRleDogMCxcbiAgICAgIHR5cGU6ICdyYW5nZScsXG4gICAgICB2YWx1ZTogMFxuICAgIH0sIGF0dHJpYnV0ZXMpO1xuXG4gICAgcmV0dXJuIHN1cGVyLmNyZWF0ZUVsKCdpbnB1dCcsIHByb3BzLCBhdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIC8vIEVWRU5UIEhBTkRMRVJTOlxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYSBgYmx1cmAgZXZlbnQgb24gdGhpcyBgU2xpZGVyYC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH5FdmVudH0gZXZlbnRcbiAgICogICAgICAgIFRoZSBgYmx1cmAgZXZlbnQgdGhhdCBjYXVzZWQgdGhpcyBmdW5jdGlvbiB0byBydW4uXG4gICAqXG4gICAqIEBsaXN0ZW5zIGJsdXJcbiAgICovXG4gIGhhbmRsZUJsdXIoZSkge1xuICAgIHRoaXMub2ZmKHRoaXMuZWxfLm93bmVyRG9jdW1lbnQsICdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlQcmVzcyk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIGNsaWNrIGV2ZW50cyBvbiBzbGlkZXIsIHVzZWQgdG8gcHJldmVudCBjbGlja3NcbiAgICogICBmcm9tIGJ1YmJsaW5nIHVwIHRvIHBhcmVudCBlbGVtZW50cyBsaWtlIGJ1dHRvbiBtZW51cy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gICAqICAgICAgICBFdmVudCB0aGF0IGNhdXNlZCB0aGlzIG9iamVjdCB0byBydW5cbiAgICovXG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGUgYSBgZm9jdXNgIGV2ZW50IG9uIHRoaXMgYFNsaWRlcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR+RXZlbnR9IGVcbiAgICogICAgICAgIFRoZSBgZm9jdXNgIGV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgZnVuY3Rpb24gdG8gcnVuLlxuICAgKlxuICAgKiBAbGlzdGVucyBmb2N1c1xuICAgKiBAbWVtYmVyT2YgRFZSU2Vla0JhclxuICAgKi9cbiAgaGFuZGxlRm9jdXMoZSkge1xuICAgdGhpcy5vbih0aGlzLmVsXy5vd25lckRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5UHJlc3MpO1xuICB9XG5cblxuICAvKipcbiAgICogSGFuZGxlIGEgYGtleWRvd25gIGV2ZW50IG9uIHRoZSBgU2xpZGVyYC4gV2F0Y2hlcyBmb3IgbGVmdCwgcmlndGgsIHVwLCBhbmQgZG93blxuICAgKiBhcnJvdyBrZXlzLiBUaGlzIGZ1bmN0aW9uIHdpbGwgb25seSBiZSBjYWxsZWQgd2hlbiB0aGUgc2xpZGVyIGhhcyBmb2N1cy4gU2VlXG4gICAqIHtAbGluayBTbGlkZXIjaGFuZGxlRm9jdXN9IGFuZCB7QGxpbmsgU2xpZGVyI2hhbmRsZUJsdXJ9LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fkV2ZW50fSBlXG4gICAqICAgICAgICB0aGUgYGtleWRvd25gIGV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgZnVuY3Rpb24gdG8gcnVuLlxuICAgKlxuICAgKiBAbGlzdGVucyBrZXlkb3duXG4gICAqL1xuICBoYW5kbGVLZXlQcmVzcyhlKSB7XG4gICAgLy8gTGVmdCBhbmQgRG93biBBcnJvd3NcbiAgICBpZiAoZS53aGljaCA9PT0gMzcgfHwgZS53aGljaCA9PT0gNDApIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuc3RlcEJhY2soKTtcblxuICAgIC8vIFVwIGFuZCBSaWdodCBBcnJvd3NcbiAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT09IDM4IHx8IGUud2hpY2ggPT09IDM5KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnN0ZXBGb3J3YXJkKCk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogSGFuZGxlIGBpbnB1dGAgZXZlbnQgb24gc2VlayBpbiB0aGUgYmFyLlxuICAgKiBcbiAgICogQGxpc3RlbnMgaW5wdXQgXG4gICAqIEBtZW1iZXJvZiBEVlJTZWVrQmFyXG4gICAqL1xuICBoYW5kbGVTZWVrSW5wdXQoKSB7XG4gIFxuICAgIGlmICghdGhpcy52aWRlb18uZHVyYXRpb24pIHtcbiAgICAgIC8vIENhbid0IHNlZWsgeWV0LiBJZ25vcmUuXG4gICAgICByZXR1cm47XG4gICAgfVxuICBcbiAgICAvLyBVcGRhdGUgdGhlIFVJIHJpZ2h0IGF3YXkuXG4gICAgLy90aGlzLnVwZGF0ZVRpbWVBbmRTZWVrUmFuZ2VfKCk7XG5cbiAgICAvLyBDb2xsZWN0IGlucHV0IGV2ZW50cyBhbmQgc2VlayB3aGVuIHRoaW5ncyBoYXZlIGJlZW4gc3RhYmxlIGZvciAxMjVtcy5cbiAgICBpZiAodGhpcy5zZWVrVGltZW91dF8gIT09IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5zZWVrVGltZW91dF8pO1xuICAgIH1cblxuICAgIHRoaXMuc2Vla1RpbWVvdXRfID0gd2luZG93LnNldFRpbWVvdXQodGhpcy5oYW5kbGVTZWVrSW5wdXRUaW1lb3V0KCksIDEyNSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBzbGlkZXIgaW5wdXQgdGltZW91dFxuICAgKiBcbiAgICogQG1lbWJlcm9mIERWUlNlZWtCYXJcbiAgICovXG4gIGhhbmRsZVNlZWtJbnB1dFRpbWVvdXQoKSB7XG5cbiAgICB0aGlzLnNlZWtUaW1lb3V0XyA9IG51bGw7XG4gICAgdGhpcy52aWRlb18uY3VycmVudFRpbWUgPSBwYXJzZUZsb2F0KHRoaXMuZWxfLnZhbHVlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEhhbmRsZSB0aGUgbW91c2UgZG93biBhbmQgdG91Y2ggc3RhcnQgZXZlbnRzXG4gICAqIFxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fkV2ZW50fSBlIFxuICAgKiBAbGlzdGVucyBtb3VzZWRvd25cbiAgICogQGxpc3RlbnMgdG91Y2hzdGFydCBcbiAgICogQG1lbWJlcm9mIERWUlNlZWtCYXJcbiAgICovXG4gIGhhbmRsZVNlZWtTdGFydChlKSB7XG5cbiAgICB0aGlzLmlzU2Vla2luZyA9IHRydWU7XG4gICAgdGhpcy52aWRlb18ucGF1c2UoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEhhbmRsZSB0aGUgbW91c2UgdXAgYW5kIHRvdWNoIGVuZCBldmVudHNcbiAgICogXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR+RXZlbnR9IGUgXG4gICAqIEBsaXN0ZW5zIG1vdXNldXBcbiAgICogQGxpc3RlbnMgdG91Y2hlbmRcbiAgICogQG1lbWJlcm9mIERWUlNlZWtCYXJcbiAgICovXG4gIGhhbmRsZVNlZWtFbmQoZSkge1xuXG4gICAgaWYgKHRoaXMuc2Vla1RpbWVvdXRfICE9IG51bGwpIHtcbiAgICAgIC8vIFRoZXkganVzdCBsZXQgZ28gb2YgdGhlIHNlZWsgYmFyLCBzbyBlbmQgdGhlIHRpbWVyIGVhcmx5LlxuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnNlZWtUaW1lb3V0Xyk7XG4gICAgICB0aGlzLmhhbmRsZVNlZWtJbnB1dFRpbWVvdXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzU2Vla2luZyA9IGZhbHNlO1xuICAgIHRoaXMudmlkZW9fLnBsYXkoKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IERWUlNlZWtCYXI7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAZmlsZSBwbHVnaW4uanNcbiAqIEBtb2R1bGUgZHZyc2Vla2JhclBsdWdpblxuICovXG5pbXBvcnQgdmlkZW9qcyBmcm9tICd2aWRlby5qcyc7XG5pbXBvcnQgRFZSc2Vla0JhciBmcm9tICcuL0RWUlNlZWtCYXInO1xuXG52aWRlb2pzLnJlZ2lzdGVyQ29tcG9uZW50KCdEVlJzZWVrQmFyJywgRFZSc2Vla0Jhcik7XG5cbi8vIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHBsdWdpbi5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBzdGFydFRpbWU6IDAsXG4gIGRpc2FibGVEVlJzbGlkZXI6IGZhbHNlXG59O1xuXG5jb25zdCBWQUxJRF9PUFRJT05TID0ge1xuICBzdGFydFRpbWU6ICdudW1iZXInLFxuICBkaXNhYmxlRFZSc2xpZGVyOiAnYm9vbGVhbidcbn07XG5cbi8qKlxuICogQSB2aWRlby5qcyBwbHVnaW4uXG4gKlxuICogSW4gdGhlIHBsdWdpbiBmdW5jdGlvbiwgdGhlIHZhbHVlIG9mIGB0aGlzYCBpcyBhIHZpZGVvLmpzIGBQbGF5ZXJgXG4gKiBpbnN0YW5jZS4gWW91IGNhbm5vdCByZWx5IG9uIHRoZSBwbGF5ZXIgYmVpbmcgaW4gYSBcInJlYWR5XCIgc3RhdGUgaGVyZSxcbiAqIGRlcGVuZGluZyBvbiBob3cgdGhlIHBsdWdpbiBpcyBpbnZva2VkLiBUaGlzIG1heSBvciBtYXkgbm90IGJlIGltcG9ydGFudFxuICogdG8geW91OyBpZiBub3QsIHJlbW92ZSB0aGUgd2FpdCBmb3IgXCJyZWFkeVwiIVxuICpcbiAqIEBmdW5jdGlvbiBkdnJzZWVrYmFyUGx1Z2luXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKiAgICAgICAgICAgQW4gb2JqZWN0IG9mIG9wdGlvbnMgbGVmdCB0byB0aGUgcGx1Z2luIGF1dGhvciB0byBkZWZpbmUuXG4gKi9cbmNvbnN0IGR2cnNlZWtiYXJQbHVnaW4gPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgLy8gSWYgZXhwbGljaXR5IHNldCBvcHRpb25zIHRvIGZhbHNlIGRpc2FibGUgcGx1Z2luOlxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09PSAnYm9vbGVhbicgJiYgb3B0aW9ucyA9PT0gZmFsc2UgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zIHx8IG9wdGlvbnMgPT09IHt9KSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgb3B0aW9ucyBhcmUgdmFsaWQ6XG4gIGxldCBwcm9wcyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gcHJvcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBsZXQga2V5ID0gcHJvcHNbaV07XG5cbiAgICBpZiAoIVZBTElEX09QVElPTlMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29uc29sZS53YXJuKCcke2tleX0gb3B0aW9uIGlzIG5vdCBhIHZhbGlkIHByb3BlcnR5LCBpZ25vcmVkLicpO1xuICAgICAgZGVsZXRlIG9wdGlvbnNba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgXG4gICAgICBpZiAodHlwZW9mKG9wdGlvbnNba2V5XSkgIT09IFZBTElEX09QVElPTlNba2V5XSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJyR7a2V5fSBvcHRpb24gdmFsdWUgbXVzdCBiZSAke1ZBTElEX09QVElPTlNba2V5XX0sIGlnbm9yZWQuJyk7XG4gICAgICAgIGRlbGV0ZSBvcHRpb25zIFtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRpb25zLmRpc2FibGVEVlJzbGlkZXIpIHtcbiAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ3Byb2dyZXNzQ29udHJvbCcpO1xuICAgIHRoaXMuY29udHJvbEJhci5yZW1vdmVDaGlsZCgndGltZURpdmlkZXInKTtcbiAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ2R1cmF0aW9uRGlzcGxheScpO1xuICAgIFxuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMub25lKCdkdXJhdGlvbmNoYW5nZScsIChlKSA9PiB7XG4gICAgY29uc3QgSVNfTElWRV9TVFJFQU0gPSB0aGlzLmR1cmF0aW9uKCkgPiAxZSszMDA7XG5cbiAgICBpZiAoSVNfTElWRV9TVFJFQU0pIHtcbiAgICAgIHRoaXMuY29udHJvbEJhci5yZW1vdmVDaGlsZCgncHJvZ3Jlc3NDb250cm9sJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ2R1cmF0aW9uRGlzcGxheScpO1xuXG4gICAgICB0aGlzLmNvbnRyb2xCYXIubGl2ZURpc3BsYXkuYWRkQ2hpbGQoJ0RWUnNlZWtCYXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYodGhpcy5jb250cm9sQmFyLmxpdmVEaXNwbGF5LmdldENoaWxkKCdEVlJzZWVrQmFyJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNvbnRyb2xCYXIubGl2ZURpc3BsYXkucmVtb3ZlQ2hpbGQoJ0RWUnNlZWtCYXInKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xCYXIuYWRkQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgICAgIHRoaXMuY29udHJvbEJhci5hZGRDaGlsZCgnZHVyYXRpb25EaXNwbGF5Jyk7XG4gICAgICAgIHRoaXMuY29udHJvbEJhci5hZGRDaGlsZCgncHJvZ3Jlc3NDb250cm9sJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIEluY2x1ZGUgdGhlIHZlcnNpb24gbnVtYmVyLlxuZHZyc2Vla2JhclBsdWdpbi5WRVJTSU9OID0gJ19fVkVSU0lPTl9fJztcblxuLy8gUmVnaXN0ZXIgdGhlIHBsdWdpbiB3aXRoIHZpZGVvLmpzLlxuLy8gVXBkYXRlZCBmb3IgdmlkZW8uanMgNiAtIGh0dHBzOi8vZ2l0aHViLmNvbS92aWRlb2pzL3ZpZGVvLmpzL3dpa2kvVmlkZW8uanMtNi1NaWdyYXRpb24tR3VpZGVcbmNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gdmlkZW9qcy5yZWdpc3RlclBsdWdpbiB8fCB2aWRlb2pzLnBsdWdpbjtcblxucmVnaXN0ZXJQbHVnaW4oJ2R2cnNlZWtiYXInLCBkdnJzZWVrYmFyUGx1Z2luKTtcbmV4cG9ydCBkZWZhdWx0IGR2cnNlZWtiYXJQbHVnaW47XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuIl19
