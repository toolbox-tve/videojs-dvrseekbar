/**
 * @file dvr-live-control.js
 */
import DVRseekBar from './DVRSeekBar';

const Component = videojs.getComponent('Component');

/**
 * Displays the live indicator when duration is Infinity.
 *
 * @extends Component
 */
class DVRLiveControl extends Component {

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
    super(player, options);

    this.contentEl_ = null;

    this.updateShowing();
    this.on(this.player(), 'durationchange', this.updateShowing);
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl('div', {
      className: 'vjs-dvr-live-control vjs-control'
    });

    return el;
  }

  /**
   * Check the duration to see if the LiveDisplay should be showing or not. Then show/hide
   * it accordingly
   *
   * @param {EventTarget~Event} [event]
   *        The {@link Player#durationchange} event that caused this function to run.
   *
   * @listens Player#durationchange
   */
  updateShowing(event) {
      this.show();
      //TODO: Ver la mejor manera de detectar los live
    /*if (this.player().duration() === Infinity) {
      this.show();
    } else {
      this.hide();
    }*/
  }

  name() {
      return super.name();
  }

}

/**
 * Default options
 *
 * @type {Object}
 * @private
 */
DVRLiveControl.prototype.options_ = {
    children: [
      'DVRseekBar'
    ]
  };

Component.registerComponent('DVRLiveControl', DVRLiveControl);
export default DVRLiveControl;
