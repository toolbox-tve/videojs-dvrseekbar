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

    this.bar = this.getChild(this.options_.barName);

    this.on('blur', this.handleBlur);
    this.on('click', this.handleClick);
    this.on('focus', this.handleFocus);
    /*this.on('input', this.handleInput);
    this.on('mousedown', this.handleMouseDown);
    this.on('mouseup', this.handleMouseUp);
    this.on('touchend', this.handleMouseUp);
    this.on('touchstart', this.handleMouseDown);*/
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
    value: function handleBlur() {
      this.off(this.bar.el_.ownerDocument, 'keydown', this.handleKeyPress);
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
     * @param {EventTarget~Event} event
     *        The `focus` event that caused this function to run.
     *
     * @listens focus
     */
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      this.on(this.bar.el_.ownerDocument, 'keydown', this.handleKeyPress);
    }

    /**
     * Handle a `keydown` event on the `Slider`. Watches for left, rigth, up, and down
     * arrow keys. This function will only be called when the slider has focus. See
     * {@link Slider#handleFocus} and {@link Slider#handleBlur}.
     *
     * @param {EventTarget~Event} event
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
  }]);

  return DVRSeekBar;
})(Component);

Component.registerComponent('DVRseekBar', DVRSeekBar);
exports['default'] = DVRSeekBar;

//////////////////////////
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
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

  this.one('durationchange', function (e) {
    var IS_LIVE_STREAM = _this.duration() > 1e+300;
    //
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

},{"./DVRSeekBar":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL0RWUlNlZWtCYXIuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBS08sVUFBVTs7OztBQUU5QixJQUFNLFNBQVMsR0FBRyxxQkFBUSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7Ozs7Ozs7SUFNOUMsVUFBVTtZQUFWLFVBQVU7Ozs7Ozs7Ozs7OztBQVdILFdBWFAsVUFBVSxDQVdGLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBWHpCLFVBQVU7O0FBYVosUUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNWLGFBQU8sR0FBRyxFQUFFLENBQUM7S0FDaEI7O0FBRUQsK0JBakJFLFVBQVUsNkNBaUJOLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRXZCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoRCxRQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7Ozs7O0dBTXBDOzs7Ozs7Ozs7ZUE3QkcsVUFBVTs7V0FzQ04sb0JBQTBCO1VBQXpCLEtBQUsseURBQUMsRUFBRTtVQUFFLFVBQVUseURBQUMsRUFBRTs7QUFFOUIsV0FBSyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztBQUN4QyxXQUFLLEdB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QyxXQUFXLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUNuRSxjQUFLLFVBQVUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV0RCxjQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEMsY0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDNUMsY0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7T0FDN0M7S0FDRjtHQUNGLENBQUMsQ0FBQztDQUNKLENBQUM7OztBQUdGLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7Ozs7QUFJekMsSUFBTSxjQUFjLEdBQUcscUJBQVEsY0FBYyxJQUFJLHFCQUFRLE1BQU0sQ0FBQzs7QUFFaEUsY0FBYyxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO3FCQUNoQyxnQkFBZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAZmlsZSBEVlJTZWVrQmFyLmpzXG4gKiBAbW9kdWxlIERWUlNlZWtCYXJcbiAqL1xuaW1wb3J0IHZpZGVvanMgZnJvbSAndmlkZW8uanMnO1xuXG5jb25zdCBDb21wb25lbnQgPSB2aWRlb2pzLmdldENvbXBvbmVudCgnQ29tcG9uZW50Jyk7XG5cbi8qKlxuICogVmlkZW9KUyBjb21wb25lbnQgY2xhc3NcbiAqIEBjbGFzcyBEVlJTZWVrQmFyXG4gKi9cbmNsYXNzIERWUlNlZWtCYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIC8qKlxuICAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzXG4gICpcbiAgKiBAcGFyYW0ge1BsYXllcn0gcGxheWVyXG4gICogICAgICAgIFRoZSBgUGxheWVyYCB0aGF0IHRoaXMgY2xhc3Mgc2hvdWxkIGJlIGF0dGFjaGVkIHRvLlxuICAqXG4gICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAqICAgICAgICBUaGUga2V5L3ZhbHVlIHN0b3JlIG9mIHBsYXllciBvcHRpb25zLlxuICAqL1xuICBjb25zdHJ1Y3RvcihwbGF5ZXIsIG9wdGlvbnMpIHtcblxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgc3VwZXIocGxheWVyLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYmFyID0gdGhpcy5nZXRDaGlsZCh0aGlzLm9wdGlvbnNfLmJhck5hbWUpO1xuXG4gICAgdGhpcy5vbignYmx1cicsIHRoaXMuaGFuZGxlQmx1cik7XG4gICAgdGhpcy5vbignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrKTtcbiAgICB0aGlzLm9uKCdmb2N1cycsIHRoaXMuaGFuZGxlRm9jdXMpO1xuICAgIC8qdGhpcy5vbignaW5wdXQnLCB0aGlzLmhhbmRsZUlucHV0KTtcbiAgICB0aGlzLm9uKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZU1vdXNlRG93bik7XG4gICAgdGhpcy5vbignbW91c2V1cCcsIHRoaXMuaGFuZGxlTW91c2VVcCk7XG4gICAgdGhpcy5vbigndG91Y2hlbmQnLCB0aGlzLmhhbmRsZU1vdXNlVXApO1xuICAgIHRoaXMub24oJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZU1vdXNlRG93bik7Ki9cbiAgfVxuXG5cbiAgLyoqXG4gICogQ3JlYXRlIHRoZSBgQ29tcG9uZW50YCdzIERPTSBlbGVtZW50XG4gICpcbiAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAqICAgICAgICAgVGhlIGVsZW1lbnQgdGhhdCB3YXMgY3JlYXRlZC5cbiAgKi9cbiAgY3JlYXRlRWwocHJvcHM9e30sIGF0dHJpYnV0ZXM9e30pIHtcblxuICAgIHByb3BzLmNsYXNzTmFtZSA9ICd2anMtcHJvZ3Jlc3MtaG9sZGVyJztcbiAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdGFiSW5kZXg6IDBcbiAgICB9LCBwcm9wcyk7XG5cbiAgICBhdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBtYXg6IDEsXG4gICAgICBtaW46IDAsXG4gICAgICBzdGVwOiAnYW55JyxcbiAgICAgIHRhYkluZGV4OiAwLFxuICAgICAgdHlwZTogJ3JhbmdlJyxcbiAgICAgIHZhbHVlOiAwXG4gICAgfSwgYXR0cmlidXRlcyk7XG5cbiAgICByZXR1cm4gc3VwZXIuY3JlYXRlRWwoJ2lucHV0JywgcHJvcHMsIGF0dHJpYnV0ZXMpO1xuICB9XG5cbiAgLy8gRVZFTlQgSEFORExFUlM6XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhIGBibHVyYCBldmVudCBvbiB0aGlzIGBTbGlkZXJgLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fkV2ZW50fSBldmVudFxuICAgKiAgICAgICAgVGhlIGBibHVyYCBldmVudCB0aGF0IGNhdXNlZCB0aGlzIGZ1bmN0aW9uIHRvIHJ1bi5cbiAgICpcbiAgICogQGxpc3RlbnMgYmx1clxuICAgKi9cbiAgaGFuZGxlQmx1cigpIHtcbiAgICB0aGlzLm9mZih0aGlzLmJhci5lbF8ub3duZXJEb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleVByZXNzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgY2xpY2sgZXZlbnRzIG9uIHNsaWRlciwgdXNlZCB0byBwcmV2ZW50IGNsaWNrc1xuICAgKiAgIGZyb20gYnViYmxpbmcgdXAgdG8gcGFyZW50IGVsZW1lbnRzIGxpa2UgYnV0dG9uIG1lbnVzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAgICogICAgICAgIEV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgb2JqZWN0IHRvIHJ1blxuICAgKi9cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhIGBmb2N1c2AgZXZlbnQgb24gdGhpcyBgU2xpZGVyYC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH5FdmVudH0gZXZlbnRcbiAgICogICAgICAgIFRoZSBgZm9jdXNgIGV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgZnVuY3Rpb24gdG8gcnVuLlxuICAgKlxuICAgKiBAbGlzdGVucyBmb2N1c1xuICAgKi9cbiAgaGFuZGxlRm9jdXMoKSB7XG4gICB0aGlzLm9uKHRoaXMuYmFyLmVsXy5vd25lckRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5UHJlc3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhIGBrZXlkb3duYCBldmVudCBvbiB0aGUgYFNsaWRlcmAuIFdhdGNoZXMgZm9yIGxlZnQsIHJpZ3RoLCB1cCwgYW5kIGRvd25cbiAgICogYXJyb3cga2V5cy4gVGhpcyBmdW5jdGlvbiB3aWxsIG9ubHkgYmUgY2FsbGVkIHdoZW4gdGhlIHNsaWRlciBoYXMgZm9jdXMuIFNlZVxuICAgKiB7QGxpbmsgU2xpZGVyI2hhbmRsZUZvY3VzfSBhbmQge0BsaW5rIFNsaWRlciNoYW5kbGVCbHVyfS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH5FdmVudH0gZXZlbnRcbiAgICogICAgICAgIHRoZSBga2V5ZG93bmAgZXZlbnQgdGhhdCBjYXVzZWQgdGhpcyBmdW5jdGlvbiB0byBydW4uXG4gICAqXG4gICAqIEBsaXN0ZW5zIGtleWRvd25cbiAgICovXG4gIGhhbmRsZUtleVByZXNzKGUpIHtcbiAgICAvLyBMZWZ0IGFuZCBEb3duIEFycm93c1xuICAgIGlmIChlLndoaWNoID09PSAzNyB8fCBlLndoaWNoID09PSA0MCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5zdGVwQmFjaygpO1xuXG4gICAgLy8gVXAgYW5kIFJpZ2h0IEFycm93c1xuICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PT0gMzggfHwgZS53aGljaCA9PT0gMzkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuc3RlcEZvcndhcmQoKTtcbiAgICB9XG4gIH1cblxufVxuXG5Db21wb25lbnQucmVnaXN0ZXJDb21wb25lbnQoJ0RWUnNlZWtCYXInLCBEVlJTZWVrQmFyKTtcbmV4cG9ydCBkZWZhdWx0IERWUlNlZWtCYXI7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAZmlsZSBwbHVnaW4uanNcbiAqIEBtb2R1bGUgZHZyc2Vla2JhclBsdWdpblxuICovXG5pbXBvcnQgdmlkZW9qcyBmcm9tICd2aWRlby5qcyc7XG5pbXBvcnQgRFZSc2Vla0JhciBmcm9tICcuL0RWUlNlZWtCYXInO1xuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHN0YXJ0VGltZTogMCxcbiAgZGlzYWJsZURWUnNsaWRlcjogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIHZpZGVvLmpzIHBsdWdpbi5cbiAqXG4gKiBJbiB0aGUgcGx1Z2luIGZ1bmN0aW9uLCB0aGUgdmFsdWUgb2YgYHRoaXNgIGlzIGEgdmlkZW8uanMgYFBsYXllcmBcbiAqIGluc3RhbmNlLiBZb3UgY2Fubm90IHJlbHkgb24gdGhlIHBsYXllciBiZWluZyBpbiBhIFwicmVhZHlcIiBzdGF0ZSBoZXJlLFxuICogZGVwZW5kaW5nIG9uIGhvdyB0aGUgcGx1Z2luIGlzIGludm9rZWQuIFRoaXMgbWF5IG9yIG1heSBub3QgYmUgaW1wb3J0YW50XG4gKiB0byB5b3U7IGlmIG5vdCwgcmVtb3ZlIHRoZSB3YWl0IGZvciBcInJlYWR5XCIhXG4gKlxuICogQGZ1bmN0aW9uIGR2cnNlZWtiYXJQbHVnaW5cbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3QgZHZyc2Vla2JhclBsdWdpbiA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAvLyBJZiBleHBsaWNpdHkgc2V0IG9wdGlvbnMgdG8gZmFsc2UgZGlzYWJsZSBwbHVnaW46XG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT09ICdib29sZWFuJyAmJiBvcHRpb25zID09PSBmYWxzZSApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIW9wdGlvbnMgfHwgb3B0aW9ucyA9PT0ge30pIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdHM7XG4gIH1cblxuXG4gIHRoaXMub25lKCdkdXJhdGlvbmNoYW5nZScsIChlKSA9PiB7XG4gICAgY29uc3QgSVNfTElWRV9TVFJFQU0gPSB0aGlzLmR1cmF0aW9uKCkgPiAxZSszMDA7XG4gICAgLy9cbiAgICBpZiAoSVNfTElWRV9TVFJFQU0pIHtcbiAgICAgIHRoaXMuY29udHJvbEJhci5yZW1vdmVDaGlsZCgncHJvZ3Jlc3NDb250cm9sJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgICB0aGlzLmNvbnRyb2xCYXIucmVtb3ZlQ2hpbGQoJ2R1cmF0aW9uRGlzcGxheScpO1xuXG4gICAgICB0aGlzLmNvbnRyb2xCYXIubGl2ZURpc3BsYXkuYWRkQ2hpbGQoJ0RWUnNlZWtCYXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYodGhpcy5jb250cm9sQmFyLmxpdmVEaXNwbGF5LmdldENoaWxkKCdEVlJzZWVrQmFyJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNvbnRyb2xCYXIubGl2ZURpc3BsYXkucmVtb3ZlQ2hpbGQoJ0RWUnNlZWtCYXInKTtcblxuICAgICAgICB0aGlzLmNvbnRyb2xCYXIuYWRkQ2hpbGQoJ3RpbWVEaXZpZGVyJyk7XG4gICAgICAgIHRoaXMuY29udHJvbEJhci5hZGRDaGlsZCgnZHVyYXRpb25EaXNwbGF5Jyk7XG4gICAgICAgIHRoaXMuY29udHJvbEJhci5hZGRDaGlsZCgncHJvZ3Jlc3NDb250cm9sJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIEluY2x1ZGUgdGhlIHZlcnNpb24gbnVtYmVyLlxuZHZyc2Vla2JhclBsdWdpbi5WRVJTSU9OID0gJ19fVkVSU0lPTl9fJztcblxuLy8gUmVnaXN0ZXIgdGhlIHBsdWdpbiB3aXRoIHZpZGVvLmpzLlxuLy8gVXBkYXRlZCBmb3IgdmlkZW8uanMgNiAtIGh0dHBzOi8vZ2l0aHViLmNvbS92aWRlb2pzL3ZpZGVvLmpzL3dpa2kvVmlkZW8uanMtNi1NaWdyYXRpb24tR3VpZGVcbmNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gdmlkZW9qcy5yZWdpc3RlclBsdWdpbiB8fCB2aWRlb2pzLnBsdWdpbjtcblxucmVnaXN0ZXJQbHVnaW4oJ2R2cnNlZWtiYXInLCBkdnJzZWVrYmFyUGx1Z2luKTtcbmV4cG9ydCBkZWZhdWx0IGR2cnNlZWtiYXJQbHVnaW47XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuIl19
