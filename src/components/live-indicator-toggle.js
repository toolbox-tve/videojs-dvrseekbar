/**
 * @file live-indicator-toggle.js
 */

const Component = videojs.getComponent('Component'),
    Button = videojs.getComponent('Button');

/**
 * Button to toggle between play and pause.
 *
 * @extends Button
 */
class LiveIndicatorToggle extends Button {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options) {
    let sourceHandler = player.tech_.sourceHandler_;

    super(player, options);

    this.video_ = player.tech_.el_;
    this.mediaPlayer_ = null;

    if (sourceHandler.constructor.name === 'ShakaTech') {
        this.mediaPlayer_ = sourceHandler.mediaPlayer_;
    }

    //this.on(player, 'play', this.handlePlay);
    //this.on(player, 'pause', this.handlePause);
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `vjs-dvr-live-indicator ${super.buildCSSClass()}`;
  }

  /**
   * This gets called when an `PlayToggle` is "clicked". See
   * {@link ClickableComponent} for more detailed information on what a click can be.
   *
   * @param {EventTarget~Event} [event]
   *        The `keydown`, `tap`, or `click` event that caused this function to be
   *        called.
   *
   * @listens tap
   * @listens click
   */
  handleClick(event) {
    let inputSeekbar = this.el().previousSibling;

    this.video_.currentTime = inputSeekbar.max || 0;
  }

  /**
   * Add the vjs-playing class to the element so it can change appearance.
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#play
   */
  handlePlay(event) {
    this.removeClass('vjs-paused');
    this.addClass('vjs-playing');
    // change the button text to "Pause"
    this.controlText('Pause');
  }

  /**
   * Add the vjs-paused class to the element so it can change appearance.
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#pause
   */
  handlePause(event) {
    this.removeClass('vjs-playing');
    this.addClass('vjs-paused');
    // change the button text to "Play"
    this.controlText('Play');
  }

}

/**
 * The text that should display over the `PlayToggle`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
LiveIndicatorToggle.prototype.controlText_ = 'Go to Live';

Component.registerComponent('LiveIndicatorToggle', LiveIndicatorToggle);
export default LiveIndicatorToggle;
///////////////////////////////////
