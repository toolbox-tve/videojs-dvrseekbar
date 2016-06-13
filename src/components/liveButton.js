import videojs from 'video.js';
import debug from '../utils/debug.js';

// Inherit from video.js live display
const BaseLiveDisplay = videojs.getComponent('LiveDisplay');

const liveButtonPrototype = {

  constructor: function() {
    BaseLiveDisplay.prototype.constructor.apply(this, arguments);

    this.emitTapEvents();
    this.on('tap', this.handleClick);
    this.on('click', this.handleClick);
  },

  createEl: function() {
    let el = BaseLiveDisplay.prototype.createEl.apply(this, arguments);

    console.log(el);

    return el;
  },

  handleClick: function() {
    this.player().playOnAir();
  },

  updateShowing: function () {
    this.show();
  }
};

const LiveButton = videojs.extend(BaseLiveDisplay, liveButtonPrototype);

// Override video.js LiveDisplay component
videojs.registerComponent('LiveDisplay', LiveButton);

export default LiveButton;
