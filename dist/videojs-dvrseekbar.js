(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsDvrseekbar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var Component = _videoJs2['default'].getComponent('Component');

/**
 *
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
  }]);

  return DVRSeekBar;
})(Component);

Component.registerComponent('DVRseekBar', DVRSeekBar);
exports['default'] = DVRSeekBar;
module.exports = exports['default'];

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

var _DVRSeekBar = require('./DVRSeekBar');

var _DVRSeekBar2 = _interopRequireDefault(_DVRSeekBar);

// Default options for the plugin.
var defaults = {
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
 * @function dvrseekbar
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var dvrseekbar = function dvrseekbar(options) {
  var _this = this;

  // If explicity set options to false disable plugin:
  if (typeof options === 'boolean' && options === false) {
    return;
  }

  if (!options || options === {}) {
    options = defaults;
  }

  this.one('durationchange', function (e) {
    var IS_LIVE_STREAM = _this.duration() > 1e+300;

    if (IS_LIVE_STREAM) {
      //let dvrSeekBar = new DVRseekBar();

      _this.controlBar.removeChild('progressControl');
      _this.controlBar.removeChild('timeDivider');
      _this.controlBar.removeChild('durationDisplay');
      /*
            this.addClass('vjs-dvrseekbar');
            this.controlBar.addClass('vjs-dvrseekbar-control-bar');
            this.controlBar.progressControl.addClass('vjs-dvrseekbar-progress-control');*/

      _this.controlBar.liveDisplay.addChild('DVRseekBar');
    } else {
      if (_this.controlBar.progressControl.getChild('DVRseekBar') !== undefined) {
        _this.controlBar.progressControl.removeChild('DVRseekBar');
        _this.controlBar.addChild('timeDivider');
        _this.controlBar.addChild('durationDisplay');
        _this.controlBar.progressControl.addChild('seekBar');
      }
    }
  });

  this.ready(function () {

    /*let dvrSeekBar = new DVRseekBar({
      player: this
    });
     this.controlBar.progressControl.el_.appendChild(dvrSeekBar.getEl());*/
  });
};

// Register the plugin with video.js.
// Updated for video.js 6 - https://github.com/videojs/video.js/wiki/Video.js-6-Migration-Guide
var registerPlugin = _videoJs2['default'].registerPlugin || _videoJs2['default'].plugin;

registerPlugin('dvrseekbar', dvrseekbar);

// Include the version number.
dvrseekbar.VERSION = '0.2.6';

exports['default'] = dvrseekbar;

//////////////////////////
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./DVRSeekBar":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL0RWUlNlZWtCYXIuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBS08sVUFBVTs7OztBQUU5QixJQUFNLFNBQVMsR0FBRyxxQkFBUSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7Ozs7SUFNOUMsVUFBVTtZQUFWLFVBQVU7Ozs7Ozs7Ozs7OztBQVdELFdBWFQsVUFBVSxDQVdBLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBWDNCLFVBQVU7O0FBYVIsUUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNWLGFBQU8sR0FBRyxFQUFFLENBQUM7S0FDaEI7O0FBRUQsK0JBakJGLFVBQVUsNkNBaUJGLE1BQU0sRUFBRSxPQUFPLEVBQUU7R0FDMUI7Ozs7Ozs7OztlQWxCQyxVQUFVOztXQTJCSixvQkFBMEI7VUFBekIsS0FBSyx5REFBQyxFQUFFO1VBQUUsVUFBVSx5REFBQyxFQUFFOztBQUU5QixXQUFLLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDO0FBQ3hDLFdBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3BCLGdCQUFRLEVBQUUsQ0FBQztPQUNaLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRVYsZ0JBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3pCLFdBQUcsRUFBRSxDQUFDO0FBQ04sV0FBRyxFQUFFLENBQUM7QUFDTixZQUFJLEVBQUUsS0FBSztBQUNYLGdCQUFRLEVBQUUsQ0FBQztBQUNYLFlBQUksRUFBRSxPQUFPO0FBQ2IsYUFBSyxFQUFFLENBQUM7T0FDVCxFQUFFLFVBQVUsQ0FBQyxDQUFDOztBQUVmLHdDQTNDQSxVQUFVLDBDQTJDWSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtLQUNuRDs7O1NBNUNDLFVBQVU7R0FBUyxTQUFTOztBQWdEbEMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztxQkFDdkMsVUFBVTs7Ozs7Ozs7Ozs7Ozs7O3VCQzlETCxVQUFVOzs7OzBCQUNQLGNBQWM7Ozs7O0FBRXJDLElBQU0sUUFBUSxHQUFHO0FBQ2YsV0FBUyxFQUFFLENBQUM7QUFDWixrQkFBZ0IsRUFBRSxJQUFJO0NBQ3ZCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBY0YsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQVksT0FBTyxFQUFFOzs7O0FBR25DLE1BQUksT0FBTyxPQUFPLEFBQUMsS0FBSyxTQUFTLElBQUksT0FBTyxLQUFLLEtBQUssRUFBRztBQUN2RCxXQUFPO0dBQ1I7O0FBRUQsTUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLEtBQUssRUFBRSxFQUFFO0FBQzlCLFdBQU8sR0FBRyxRQUFRLENBQUM7R0FDcEI7O0FBR0QsTUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFDLENBQUMsRUFBSztBQUNoQyxRQUFNLGNBQWMsR0FBRyxNQUFLLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQzs7QUFFaEQsUUFBSSxjQUFjLEVBQUU7OztBQUdsQixZQUFLLFVBQVUsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvQyxZQUFLLFVBQVUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0MsWUFBSyxVQUFVLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Ozs7OztBQU0vQyxZQUFLLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBRXBELE1BQU07QUFDTCxVQUFHLE1BQUssVUFBVSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQ3ZFLGNBQUssVUFBVSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUQsY0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3hDLGNBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVDLGNBQUssVUFBVSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDckQ7S0FDRjtHQUNGLENBQUMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsS0FBSyxDQUFDLFlBQU07Ozs7OztHQU9oQixDQUFDLENBQUM7Q0FDSixDQUFDOzs7O0FBSUYsSUFBSSxjQUFjLEdBQUcscUJBQVEsY0FBYyxJQUFJLHFCQUFRLE1BQU0sQ0FBQzs7QUFFOUQsY0FBYyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQzs7O0FBR3pDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDOztxQkFFcEIsVUFBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIEBmaWxlIERWUlNlZWtCYXIuanNcbiAqIEBtb2R1bGUgRFZSU2Vla0JhclxuICovXG5pbXBvcnQgdmlkZW9qcyBmcm9tICd2aWRlby5qcyc7XG5cbmNvbnN0IENvbXBvbmVudCA9IHZpZGVvanMuZ2V0Q29tcG9uZW50KCdDb21wb25lbnQnKTtcblxuLyoqXG4gKlxuICogQGNsYXNzIERWUlNlZWtCYXJcbiAqL1xuY2xhc3MgRFZSU2Vla0JhciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3NcbiAgICAqXG4gICAgKiBAcGFyYW0ge1BsYXllcn0gcGxheWVyXG4gICAgKiAgICAgICAgVGhlIGBQbGF5ZXJgIHRoYXQgdGhpcyBjbGFzcyBzaG91bGQgYmUgYXR0YWNoZWQgdG8uXG4gICAgKlxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgICogICAgICAgIFRoZSBrZXkvdmFsdWUgc3RvcmUgb2YgcGxheWVyIG9wdGlvbnMuXG4gICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXIsIG9wdGlvbnMpIHtcblxuICAgICAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyKHBsYXllciwgb3B0aW9ucyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIENyZWF0ZSB0aGUgYENvbXBvbmVudGAncyBET00gZWxlbWVudFxuICAgICpcbiAgICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAgKiAgICAgICAgIFRoZSBlbGVtZW50IHRoYXQgd2FzIGNyZWF0ZWQuXG4gICAgKi9cbiAgICBjcmVhdGVFbChwcm9wcz17fSwgYXR0cmlidXRlcz17fSkge1xuXG4gICAgICBwcm9wcy5jbGFzc05hbWUgPSAndmpzLXByb2dyZXNzLWhvbGRlcic7XG4gICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICB0YWJJbmRleDogMFxuICAgICAgfSwgcHJvcHMpO1xuXG4gICAgICBhdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgIG1heDogMSxcbiAgICAgICAgbWluOiAwLFxuICAgICAgICBzdGVwOiAnYW55JyxcbiAgICAgICAgdGFiSW5kZXg6IDAsXG4gICAgICAgIHR5cGU6ICdyYW5nZScsXG4gICAgICAgIHZhbHVlOiAwXG4gICAgICB9LCBhdHRyaWJ1dGVzKTtcblxuICAgICAgcmV0dXJuIHN1cGVyLmNyZWF0ZUVsKCdpbnB1dCcsIHByb3BzLCBhdHRyaWJ1dGVzKTtcbiAgICB9XG5cbn1cblxuQ29tcG9uZW50LnJlZ2lzdGVyQ29tcG9uZW50KCdEVlJzZWVrQmFyJywgRFZSU2Vla0Jhcik7XG5leHBvcnQgZGVmYXVsdCBEVlJTZWVrQmFyOyIsImltcG9ydCB2aWRlb2pzIGZyb20gJ3ZpZGVvLmpzJztcbmltcG9ydCBEVlJzZWVrQmFyIGZyb20gJy4vRFZSU2Vla0Jhcic7XG4vLyBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwbHVnaW4uXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgc3RhcnRUaW1lOiAwLFxuICBkaXNhYmxlRFZSc2xpZGVyOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgdmlkZW8uanMgcGx1Z2luLlxuICpcbiAqIEluIHRoZSBwbHVnaW4gZnVuY3Rpb24sIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaXMgYSB2aWRlby5qcyBgUGxheWVyYFxuICogaW5zdGFuY2UuIFlvdSBjYW5ub3QgcmVseSBvbiB0aGUgcGxheWVyIGJlaW5nIGluIGEgXCJyZWFkeVwiIHN0YXRlIGhlcmUsXG4gKiBkZXBlbmRpbmcgb24gaG93IHRoZSBwbHVnaW4gaXMgaW52b2tlZC4gVGhpcyBtYXkgb3IgbWF5IG5vdCBiZSBpbXBvcnRhbnRcbiAqIHRvIHlvdTsgaWYgbm90LCByZW1vdmUgdGhlIHdhaXQgZm9yIFwicmVhZHlcIiFcbiAqXG4gKiBAZnVuY3Rpb24gZHZyc2Vla2JhclxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICogICAgICAgICAgIEFuIG9iamVjdCBvZiBvcHRpb25zIGxlZnQgdG8gdGhlIHBsdWdpbiBhdXRob3IgdG8gZGVmaW5lLlxuICovXG5jb25zdCBkdnJzZWVrYmFyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gIC8vIElmIGV4cGxpY2l0eSBzZXQgb3B0aW9ucyB0byBmYWxzZSBkaXNhYmxlIHBsdWdpbjpcbiAgaWYgKHR5cGVvZihvcHRpb25zKSA9PT0gJ2Jvb2xlYW4nICYmIG9wdGlvbnMgPT09IGZhbHNlICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghb3B0aW9ucyB8fCBvcHRpb25zID09PSB7fSkge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0cztcbiAgfVxuXG5cbiAgdGhpcy5vbmUoJ2R1cmF0aW9uY2hhbmdlJywgKGUpID0+IHtcbiAgICBjb25zdCBJU19MSVZFX1NUUkVBTSA9IHRoaXMuZHVyYXRpb24oKSA+IDFlKzMwMDtcblxuICAgIGlmIChJU19MSVZFX1NUUkVBTSkge1xuICAgICAgLy9sZXQgZHZyU2Vla0JhciA9IG5ldyBEVlJzZWVrQmFyKCk7XG5cbiAgICAgIHRoaXMuY29udHJvbEJhci5yZW1vdmVDaGlsZCgncHJvZ3Jlc3NDb250cm9sJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ2R1cmF0aW9uRGlzcGxheScpO1xuLypcbiAgICAgIHRoaXMuYWRkQ2xhc3MoJ3Zqcy1kdnJzZWVrYmFyJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIuYWRkQ2xhc3MoJ3Zqcy1kdnJzZWVrYmFyLWNvbnRyb2wtYmFyJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucHJvZ3Jlc3NDb250cm9sLmFkZENsYXNzKCd2anMtZHZyc2Vla2Jhci1wcm9ncmVzcy1jb250cm9sJyk7Ki9cblxuICAgICAgdGhpcy5jb250cm9sQmFyLmxpdmVEaXNwbGF5LmFkZENoaWxkKCdEVlJzZWVrQmFyJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYodGhpcy5jb250cm9sQmFyLnByb2dyZXNzQ29udHJvbC5nZXRDaGlsZCgnRFZSc2Vla0JhcicpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5jb250cm9sQmFyLnByb2dyZXNzQ29udHJvbC5yZW1vdmVDaGlsZCgnRFZSc2Vla0JhcicpO1xuICAgICAgICB0aGlzLmNvbnRyb2xCYXIuYWRkQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgICAgIHRoaXMuY29udHJvbEJhci5hZGRDaGlsZCgnZHVyYXRpb25EaXNwbGF5Jyk7XG4gICAgICAgIHRoaXMuY29udHJvbEJhci5wcm9ncmVzc0NvbnRyb2wuYWRkQ2hpbGQoJ3NlZWtCYXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHRoaXMucmVhZHkoKCkgPT4ge1xuXG4gICAgLypsZXQgZHZyU2Vla0JhciA9IG5ldyBEVlJzZWVrQmFyKHtcbiAgICAgIHBsYXllcjogdGhpc1xuICAgIH0pO1xuXG4gICAgdGhpcy5jb250cm9sQmFyLnByb2dyZXNzQ29udHJvbC5lbF8uYXBwZW5kQ2hpbGQoZHZyU2Vla0Jhci5nZXRFbCgpKTsqL1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbi8vIFVwZGF0ZWQgZm9yIHZpZGVvLmpzIDYgLSBodHRwczovL2dpdGh1Yi5jb20vdmlkZW9qcy92aWRlby5qcy93aWtpL1ZpZGVvLmpzLTYtTWlncmF0aW9uLUd1aWRlXG52YXIgcmVnaXN0ZXJQbHVnaW4gPSB2aWRlb2pzLnJlZ2lzdGVyUGx1Z2luIHx8IHZpZGVvanMucGx1Z2luO1xuXG5yZWdpc3RlclBsdWdpbignZHZyc2Vla2JhcicsIGR2cnNlZWtiYXIpO1xuXG4vLyBJbmNsdWRlIHRoZSB2ZXJzaW9uIG51bWJlci5cbmR2cnNlZWtiYXIuVkVSU0lPTiA9ICdfX1ZFUlNJT05fXyc7XG5cbmV4cG9ydCBkZWZhdWx0IGR2cnNlZWtiYXI7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuIl19
