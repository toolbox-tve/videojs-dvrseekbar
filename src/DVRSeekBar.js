'use strict';
/**
 * @file DVRSeekBar.js
 * @module DVRSeekBar
 */
import videojs from 'video.js';

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
  handleBlur() {
    this.off(this.bar.el_.ownerDocument, 'keydown', this.handleKeyPress);
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
   * @param {EventTarget~Event} event
   *        The `focus` event that caused this function to run.
   *
   * @listens focus
   */
  handleFocus() {
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

}

Component.registerComponent('DVRseekBar', DVRSeekBar);
export default DVRSeekBar;
//////////////////////////
