'use strict';
/**
 * @file DVRSeekBar.js
 * @module DVRSeekBar
 */
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

/**
 *
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

}

Component.registerComponent('DVRseekBar', DVRSeekBar);
export default DVRSeekBar;