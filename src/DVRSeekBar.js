'use strict';
/**
 * @file DVRSeekBar.js
 * @module DVRSeekBar
 */
import videojs from 'video.js';
import window from 'global/window';
import { buildTimeString } from './utils';

const Component = videojs.getComponent('Component');

/**
 * VideoJS component class
 * @class DVRSeekBar
 */
class DVRSeekBar extends Component {

  /**
  * Create an instance of this class
  *
  * @param {Player} player
  *        The `Player` that this class should be attached to.
  *
  * @param {Object} [options]
  *        The key/value store of player options.
  */
  constructor(player, options) {
    let sourceHandler = player.tech_.sourceHandler_;

    if (!options) {
        options = {};
    }

    super(player, options);

    this.video_ = player.tech_.el_;
    this.mediaPlayer_ = null;
    this.isSeeking_ = false;
    this.seekTimeout_ = null;

    this.on('blur', this.handleBlur);
    this.on('click', this.handleClick);
    this.on('focus', this.handleFocus);
    this.on('input', this.handleSeekInput);
    this.on('mousedown', this.handleSeekStart);
    this.el_.addEventListener(
      'touchstart',
      this.handleSeekStart.bind(this),
      { passive: true }
    );
    this.on('mouseup', this.handleSeekEnd);
    this.on('touchend', this.handleSeekEnd);

    if (sourceHandler.constructor.name === 'ShakaTech') {

      this.mediaPlayer_ = sourceHandler.mediaPlayer_;

      /*this.mediaPlayer_.addEventListener(
          'buffering', this.handleBufferingStateChange);*/

      window.setInterval(this.updateTimeAndSeekRange.bind(this), 125);
    }

  }


  /**
  * Create the `Component`'s DOM element
  *
  * @return {Element}
  *         The element that was created.
  */
  createEl(props={}, attributes={}) {

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

    return super.createEl('input', props, attributes);
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
  handleBlur(e) {
    this.off(this.el_.ownerDocument, 'keydown', this.handleKeyPress);
  }

  /**
   * Handle a `buffering` event on current tech mediaPlayer (Shaka).
   *
   * @param {EventTarget~Event} event
   *        The `buffering` event that caused this function to run.
   *
   * @listens buffering
   */
  handleBufferingStateChange(event) {
    //this.bufferingSpinner_.style.display =
    //    event.buffering ? 'inherit' : 'none';
  }

  /**
   * Listener for click events on slider, used to prevent clicks
   *   from bubbling up to parent elements like button menus.
   *
   * @param {Object} event
   *        Event that caused this object to run
   */
  handleClick(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  /**
   * Handle a `focus` event on this `Slider`.
   *
   * @param {EventTarget~Event} e
   *        The `focus` event that caused this function to run.c
   *
   * @listens focus
   * @memberOf DVRSeekBar
   */
  handleFocus(e) {
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
  handleKeyPress(e) {
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
  handleSeekInput() {

    if (!this.video_.duration) {
      // Can't seek yet. Ignore.
      return;
    }

    // Update the UI right away.
    //this.updateTimeAndSeekRange_();

    // Collect input events and seek when things have been stable for 125ms.
    if (this.seekTimeout_ !== null) {
      window.clearTimeout(this.seekTimeout_);
    }

    this.seekTimeout_ = window.setTimeout(this.handleSeekInputTimeout(), 125);
  }

  /**
   * When slider input timeout
   *
   * @memberof DVRSeekBar
   */
  handleSeekInputTimeout() {

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
  handleSeekStart(e) {

    this.isSeeking_ = true;
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
  handleSeekEnd(e) {

    if (this.seekTimeout_ != null) {
      // They just let go of the seek bar, so end the timer early.
      window.clearTimeout(this.seekTimeout_);
      this.handleSeekInputTimeout();
    }

    this.isSeeking_ = false;
    this.video_.play();
  }

  /**
   * Update bar display data
   *
   * @returns
   * @memberof DVRSeekBar
   */
  updateTimeAndSeekRange() {
    // Suppress updates if the controls are hidden.
    if (!this.player().userActive()) {
      return;
    }
    let inputRange = this.el();
    let displayTime = this.isSeeking_ ?
      inputRange.value : this.video_.currentTime;
    let duration = this.video_.duration;
    let bufferedLength = this.video_.buffered.length;
    let bufferedStart = bufferedLength ?
      this.video_.buffered.start(0) : 0;
    let bufferedEnd = bufferedLength ?
      this.video_.buffered.end(bufferedLength - 1) : 0;
    let seekRange = this.mediaPlayer_.seekRange();
    let seekRangeSize = seekRange.end - seekRange.start;

    inputRange.min = seekRange.start;
    inputRange.max = seekRange.end;

    if (this.mediaPlayer_.isLive()) {
      // The amount of time we are behind the live edge.
      var behindLive = Math.floor(seekRange.end - displayTime);
      displayTime = Math.max(0, behindLive);

      var showHour = seekRangeSize >= 3600;
      //TODO: habilitar al incluir el timer+LIVE
      // Consider "LIVE" when less than 1 second behind the live-edge.  Always
      // show the full time string when seeking, including the leading '-';
      // otherwise, the time string "flickers" near the live-edge.
      /*if ((displayTime >= 15) || this.isSeeking_) {
        this.currentTime_.textContent =
            '- ' + buildTimeString(displayTime, showHour);
        this.currentTime_.style.cursor = 'pointer';
      } else {
        this.currentTime_.textContent = 'LIVE';
        this.currentTime_.style.cursor = '';
      }
*/
      if (!this.isSeeking_) {
        inputRange.value = seekRange.end - displayTime;
      }
    } else {
      var showHour = duration >= 3600;

      //this.currentTime_.textContent = buildTimeString(displayTime, showHour);

      if (!this.isSeeking_) {
        inputRange.value = displayTime;
      }

      //this.currentTime_.style.cursor = '';
    }

    let gradient = ['to right'];

    if (bufferedLength == 0) {
      gradient.push('#000 0%');
    } else {
      let clampedBufferStart = Math.max(bufferedStart, seekRange.start);
      let clampedBufferEnd = Math.min(bufferedEnd, seekRange.end);

      let bufferStartDistance = clampedBufferStart - seekRange.start;
      let bufferEndDistance = clampedBufferEnd - seekRange.start;
      let playheadDistance = displayTime - seekRange.start;

      // NOTE: the fallback to zero eliminates NaN.
      let bufferStartFraction = (bufferStartDistance / seekRangeSize) || 0;
      let bufferEndFraction = (bufferEndDistance / seekRangeSize) || 0;
      let playheadFraction = (playheadDistance / seekRangeSize) || 0;

      gradient.push('#000 ' + (bufferStartFraction * 100) + '%');
      gradient.push('#ccc ' + (bufferStartFraction * 100) + '%');
      gradient.push('#ccc ' + (playheadFraction * 100) + '%');
      gradient.push('#444 ' + (playheadFraction * 100) + '%');
      gradient.push('#444 ' + (bufferEndFraction * 100) + '%');
      gradient.push('#000 ' + (bufferEndFraction * 100) + '%');
    }

    inputRange.style.background =
        'linear-gradient(' + gradient.join(',') + ')';
  }

};

videojs.registerComponent('DVRseekBar', DVRSeekBar);
export default DVRSeekBar;
//////////////////////////
