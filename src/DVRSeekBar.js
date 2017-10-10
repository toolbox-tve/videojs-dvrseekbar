'use strict';
/**
 * @file DVRSeekBar.js
 * @module DVRSeekBar
 */
import videojs from 'video.js';
import window from 'global/window';

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

    if (!options) {
        options = {};
    }

    super(player, options);

    this.video_ = player.tech_.el_;

    this.isSeeking = false;
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
   *        The `focus` event that caused this function to run.
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
  handleSeekEnd(e) {

    if (this.seekTimeout_ != null) {
      // They just let go of the seek bar, so end the timer early.
      window.clearTimeout(this.seekTimeout_);
      this.handleSeekInputTimeout();
    }

    this.isSeeking = false;
    this.video_.play();
  }

}

export default DVRSeekBar;
//////////////////////////
