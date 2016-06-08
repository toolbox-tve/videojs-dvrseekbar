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
var SeekHandle = _videoJs2['default'].getComponent('SeekHandle');

SeekBar.prototype.dvrTotalTime = function (player) {
  var time = player.seekable();

  return time && time.length ? time.end(0) - time.start(0) : 0;
};

SeekBar.prototype.handleMouseMove = function (e) {
  var bufferedTime = undefined,
      newTime = undefined;

  bufferedTime = newTime = this.player_.seekable();

  if (bufferedTime && bufferedTime.length) {
    for (newTime = bufferedTime.start(0) + this.calculateDistance(e) * this.dvrTotalTime(this.player_); newTime >= bufferedTime.end(0);) newTime -= .1;

    this.player_.currentTime(newTime);
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
  var btnLiveEl = document.createElement('div'),
      newLink = document.createElement('a');

  btnLiveEl.className = 'vjs-live-button vjs-control';

  newLink.innerHTML = document.getElementsByClassName('vjs-live-display')[0].innerHTML;
  newLink.id = 'liveButton';

  if (!player.paused()) {
    newLink.className = 'label onair';
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

  var controlBar = document.getElementsByClassName('vjs-control-bar')[0],
      insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];

  controlBar.insertBefore(btnLiveEl, insertBeforeNode);

  _videoJs2['default'].log('dvrSeekbar Plugin ENABLED!', options);
};

var onTimeUpdate = function onTimeUpdate(player, e) {

  /*let time = player.seekable();
  time = time && time.length ? time.end(0) - time.start(0) : 0;
  if(time > 0) {
    player.duration(time + 2);
  }*/

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

  var player = this;

  if (!options) {
    options = defaults;
  }

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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9kYXZpZC9SZXBvcy92aWRlb2pzLWR2cnNlZWtiYXIvc3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozt1QkNBb0IsVUFBVTs7Ozs7QUFFOUIsSUFBTSxRQUFRLEdBQUc7QUFDZixXQUFTLEVBQUUsQ0FBQztDQUNiLENBQUM7O0FBRUYsSUFBTSxPQUFPLEdBQUcscUJBQVEsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELElBQU0sVUFBVSxHQUFHLHFCQUFRLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdEQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBUyxNQUFNLEVBQUU7QUFDaEQsTUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUU3QixTQUFRLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDL0QsQ0FBQzs7QUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUMsRUFBRTtBQUMvQyxNQUFJLFlBQVksWUFBQTtNQUFFLE9BQU8sWUFBQSxDQUFDOztBQUUxQixjQUFZLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRWpELE1BQUksWUFBWSxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUU7QUFDdkMsU0FBSyxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxJQUFJ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RCxNQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFDLENBQUMsRUFBSztBQUMzQixnQkFBWSxRQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLENBQUMsRUFBSztBQUNyQixRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV0RCxRQUFJLFNBQVMsRUFBRTtBQUNiLGVBQVMsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO0FBQ3BDLGVBQVMsQ0FBQyxTQUFTLEdBQUcsdURBQXVELENBQUM7S0FDL0U7R0FDRixDQUFDLENBQUM7O0FBRUgsTUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDdEIsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFdEQsYUFBUyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7R0FDMUIsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUMsQ0FBQyxFQUFLOzs7Ozs7R0FPeEIsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxLQUFLLENBQUMsWUFBTTtBQUNmLGlCQUFhLFFBQU8scUJBQVEsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0dBQzlELENBQUMsQ0FBQztDQUNKLENBQUM7OztBQUdGLHFCQUFRLE1BQU0sQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7OztBQUd6QyxVQUFVLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQzs7cUJBRXBCLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHZpZGVvanMgZnJvbSAndmlkZW8uanMnO1xuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHN0YXJ0VGltZTogMFxufTtcblxuY29uc3QgU2Vla0JhciA9IHZpZGVvanMuZ2V0Q29tcG9uZW50KCdTZWVrQmFyJyk7XG5jb25zdCBTZWVrSGFuZGxlID0gdmlkZW9qcy5nZXRDb21wb25lbnQoJ1NlZWtIYW5kbGUnKTtcblxuU2Vla0Jhci5wcm90b3R5cGUuZHZyVG90YWxUaW1lID0gZnVuY3Rpb24ocGxheWVyKSB7XG4gIGxldCB0aW1lID0gcGxheWVyLnNlZWthYmxlKCk7XG5cbiAgcmV0dXJuICB0aW1lICYmIHRpbWUubGVuZ3RoID8gdGltZS5lbmQoMCkgLSB0aW1lLnN0YXJ0KDApIDogMDtcbn07XG5cblNlZWtCYXIucHJvdG90eXBlLmhhbmRsZU1vdXNlTW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gIGxldCBidWZmZXJlZFRpbWUsIG5ld1RpbWU7XG5cbiAgYnVmZmVyZWRUaW1lID0gbmV3VGltZSA9IHRoaXMucGxheWVyXy5zZWVrYWJsZSgpO1xuXG4gIGlmIChidWZmZXJlZFRpbWUgJiYgYnVmZmVyZWRUaW1lLmxlbmd0aCkge1xuICAgIGZvciAobmV3VGltZSA9IGJ1ZmZlcmVkVGltZS5zdGFydCgwKSArIHRoaXMuY2FsY3VsYXRlRGlzdGFuY2UoZSkgKiB0aGlzLmR2clRvdGFsVGltZSh0aGlzLnBsYXllcl8pOyBuZXdUaW1lID49IGJ1ZmZlcmVkVGltZS5lbmQoMCk7KVxuICAgICAgbmV3VGltZSAtPSAuMTtcblxuICAgIHRoaXMucGxheWVyXy5jdXJyZW50VGltZShuZXdUaW1lKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIGludm9rZSB3aGVuIHRoZSBwbGF5ZXIgaXMgcmVhZHkuXG4gKlxuICogVGhpcyBpcyBhIGdyZWF0IHBsYWNlIGZvciB5b3VyIHBsdWdpbiB0byBpbml0aWFsaXplIGl0c2VsZi4gV2hlbiB0aGlzXG4gKiBmdW5jdGlvbiBpcyBjYWxsZWQsIHRoZSBwbGF5ZXIgd2lsbCBoYXZlIGl0cyBET00gYW5kIGNoaWxkIGNvbXBvbmVudHNcbiAqIGluIHBsYWNlLlxuICpcbiAqIEBmdW5jdGlvbiBvblBsYXllclJlYWR5XG4gKiBAcGFyYW0gICAge1BsYXllcn0gcGxheWVyXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKi9cbmNvbnN0IG9uUGxheWVyUmVhZHkgPSAocGxheWVyLCBvcHRpb25zKSA9PiB7XG4gIHBsYXllci5hZGRDbGFzcygndmpzLWR2cnNlZWtiYXInKTtcbiAgcGxheWVyLmNvbnRyb2xCYXIuYWRkQ2xhc3MoJ3Zqcy1kdnJzZWVrYmFyLWNvbnRyb2wtYmFyJyk7XG5cbiAgaWYgKHBsYXllci5jb250cm9sQmFyLnByb2dyZXNzQ29udHJvbCkge1xuICAgIHBsYXllci5jb250cm9sQmFyLnByb2dyZXNzQ29udHJvbC5hZGRDbGFzcygndmpzLWR2cnNlZWtiYXItcHJvZ3Jlc3MtY29udHJvbCcpO1xuICB9XG5cbiAgLy8gQUREIExpdmUgQnV0dG9uOlxuICBsZXQgYnRuTGl2ZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgbmV3TGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuICBidG5MaXZlRWwuY2xhc3NOYW1lID0gJ3Zqcy1saXZlLWJ1dHRvbiB2anMtY29udHJvbCc7XG5cbiAgbmV3TGluay5pbm5lckhUTUwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtbGl2ZS1kaXNwbGF5JylbMF0uaW5uZXJIVE1MO1xuICBuZXdMaW5rLmlkID0gJ2xpdmVCdXR0b24nO1xuXG4gIGlmICghcGxheWVyLnBhdXNlZCgpKSB7XG4gICAgbmV3TGluay5jbGFzc05hbWUgPSAnbGFiZWwgb25haXInO1xuICB9XG5cblxuICBsZXQgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgIHBsYXllci5jdXJyZW50VGltZShwbGF5ZXIuc2Vla2FibGUoKS5lbmQoMCkpO1xuXG4gICAgcGxheWVyLnBsYXkoKTtcbiAgfTtcblxuICBpZiAobmV3TGluay5hZGRFdmVudExpc3RlbmVyKSB7IC8vIERPTSBtZXRob2RcbiAgICBuZXdMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyLCBmYWxzZSk7XG4gIH0gZWxzZSBpZiAobmV3TGluay5hdHRhY2hFdmVudCkgeyAvLyB0aGlzIGlzIGZvciBJRSwgYmVjYXVzZSBpdCBkb2Vzbid0IHN1cHBvcnQgYWRkRXZlbnRMaXN0ZW5lclxuICAgIG5ld0xpbmsuYXR0YWNoRXZlbnQoJ29uY2xpY2snLCBmdW5jdGlvbigpIHsgcmV0dXJuIGNsaWNrSGFuZGxlci5hcHBseShuZXdMaW5rLCBbIHdpbmRvdy5ldmVudCBdKTsgfSk7XG4gIH1cblxuICBidG5MaXZlRWwuYXBwZW5kQ2hpbGQobmV3TGluayk7XG5cbiAgbGV0IGNvbnRyb2xCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtY29udHJvbC1iYXInKVswXSxcbiAgaW5zZXJ0QmVmb3JlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Zqcy1wcm9ncmVzcy1jb250cm9sJylbMF07XG5cbiAgY29udHJvbEJhci5pbnNlcnRCZWZvcmUoYnRuTGl2ZUVsLCBpbnNlcnRCZWZvcmVOb2RlKTtcblxuICB2aWRlb2pzLmxvZygnZHZyU2Vla2JhciBQbHVnaW4gRU5BQkxFRCEnLCBvcHRpb25zKTtcbn07XG5cbmNvbnN0IG9uVGltZVVwZGF0ZSA9IChwbGF5ZXIsIGUpID0+IHtcblxuICAvKmxldCB0aW1lID0gcGxheWVyLnNlZWthYmxlKCk7XG4gIHRpbWUgPSB0aW1lICYmIHRpbWUubGVuZ3RoID8gdGltZS5lbmQoMCkgLSB0aW1lLnN0YXJ0KDApIDogMDtcbiAgaWYodGltZSA+IDApIHtcbiAgICBwbGF5ZXIuZHVyYXRpb24odGltZSArIDIpO1xuICB9Ki9cblxuICBwbGF5ZXIuZHVyYXRpb24ocGxheWVyLnNlZWthYmxlKCkuZW5kKDApKTtcbn07XG5cbi8qKlxuICogQSB2aWRlby5qcyBwbHVnaW4uXG4gKlxuICogSW4gdGhlIHBsdWdpbiBmdW5jdGlvbiwgdGhlIHZhbHVlIG9mIGB0aGlzYCBpcyBhIHZpZGVvLmpzIGBQbGF5ZXJgXG4gKiBpbnN0YW5jZS4gWW91IGNhbm5vdCByZWx5IG9uIHRoZSBwbGF5ZXIgYmVpbmcgaW4gYSBcInJlYWR5XCIgc3RhdGUgaGVyZSxcbiAqIGRlcGVuZGluZyBvbiBob3cgdGhlIHBsdWdpbiBpcyBpbnZva2VkLiBUaGlzIG1heSBvciBtYXkgbm90IGJlIGltcG9ydGFudFxuICogdG8geW91OyBpZiBub3QsIHJlbW92ZSB0aGUgd2FpdCBmb3IgXCJyZWFkeVwiIVxuICpcbiAqIEBmdW5jdGlvbiBkdnJzZWVrYmFyXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKiAgICAgICAgICAgQW4gb2JqZWN0IG9mIG9wdGlvbnMgbGVmdCB0byB0aGUgcGx1Z2luIGF1dGhvciB0byBkZWZpbmUuXG4gKi9cbmNvbnN0IGR2cnNlZWtiYXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGNvbnN0IHBsYXllciA9IHRoaXM7XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRzO1xuICB9XG5cbiAgdGhpcy5vbigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgb25UaW1lVXBkYXRlKHRoaXMsIGUpO1xuICB9KTtcblxuICB0aGlzLm9uKCdwbGF5JywgKGUpID0+IHtcbiAgICBsZXQgYnRuTGl2ZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpdmVCdXR0b24nKTtcblxuICAgIGlmIChidG5MaXZlRWwpIHtcbiAgICAgIGJ0bkxpdmVFbC5jbGFzc05hbWUgPSAnbGFiZWwgb25haXInO1xuICAgICAgYnRuTGl2ZUVsLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cInZqcy1jb250cm9sLXRleHRcIj5TdHJlYW0gVHlwZTwvc3Bhbj5MSVZFJztcbiAgICB9XG4gIH0pO1xuXG4gIHRoaXMub24oJ3BhdXNlJywgKGUpID0+IHtcbiAgICBsZXQgYnRuTGl2ZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpdmVCdXR0b24nKTtcblxuICAgIGJ0bkxpdmVFbC5jbGFzc05hbWUgPSAnJztcbiAgfSk7XG5cbiAgdGhpcy5vbignc2Vla2VkJywgKGUpID0+IHtcbiAgICAvKiBsZXQgYnRuTGl2ZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpdmVCdXR0b24nKTtcblxuICAgIGlmIChwbGF5ZXIuZHVyYXRpb24oKSA8IHBsYXllci5jdXJyZW50VGltZSgpKSB7XG4gICAgICAgIGJ0bkxpdmVFbC5jbGFzc05hbWUgPSAnbGFiZWwnO1xuICAgICAgICBidG5MaXZlRWwuaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPVwidmpzLWNvbnRyb2wtdGV4dFwiPlN0cmVhbSBUeXBlPC9zcGFuPkRWUic7XG4gICAgfSAqL1xuICB9KTtcblxuICB0aGlzLnJlYWR5KCgpID0+IHtcbiAgICBvblBsYXllclJlYWR5KHRoaXMsIHZpZGVvanMubWVyZ2VPcHRpb25zKGRlZmF1bHRzLCBvcHRpb25zKSk7XG4gIH0pO1xufTtcblxuLy8gUmVnaXN0ZXIgdGhlIHBsdWdpbiB3aXRoIHZpZGVvLmpzLlxudmlkZW9qcy5wbHVnaW4oJ2R2cnNlZWtiYXInLCBkdnJzZWVrYmFyKTtcblxuLy8gSW5jbHVkZSB0aGUgdmVyc2lvbiBudW1iZXIuXG5kdnJzZWVrYmFyLlZFUlNJT04gPSAnX19WRVJTSU9OX18nO1xuXG5leHBvcnQgZGVmYXVsdCBkdnJzZWVrYmFyO1xuIl19
