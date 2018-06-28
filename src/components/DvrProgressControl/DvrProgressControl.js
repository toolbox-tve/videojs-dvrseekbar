import videojs from 'video.js';
import './DvrSeekBar/DvrSeekBar';

const ProgressControl = videojs.getComponent('ProgressControl');

class DvrProgressControl extends ProgressControl {
  handleMouseMove(event) {
    const seekBar = this.getChild('DvrSeekBar');

    if (seekBar) {
      const mouseTimeDisplay = seekBar.getChild('DvrMouseTimeDisplay');
      const seekBarEl = seekBar.el();
      const seekBarRect = videojs.dom.getBoundingClientRect(seekBarEl);
      let seekBarPoint = videojs.dom.getPointerPosition(seekBarEl, event).x;

      // The default skin has a gap on either side of the `SeekBar`. This means
      // that it's possible to trigger this behavior outside the boundaries of
      // the `SeekBar`. This ensures we stay within it at all times.
      if (seekBarPoint > 1) {
        seekBarPoint = 1;
      } else if (seekBarPoint < 0) {
        seekBarPoint = 0;
      }

      if (mouseTimeDisplay) {
        mouseTimeDisplay.update(seekBarRect, seekBarPoint);
      }
    }
  }

  handleMouseSeek(event) {
    const seekBar = this.getChild('DvrSeekBar');

    if (seekBar) {
      seekBar.handleMouseMove(event);
    }
  }

  handleMouseDown(event) {
    const doc = this.el_.ownerDocument;
    const seekBar = this.getChild('DvrSeekBar');

    if (seekBar) {
      seekBar.handleMouseDown(event);
    }

    this.on(doc, 'mousemove', this.throttledHandleMouseSeek);
    this.on(doc, 'touchmove', this.throttledHandleMouseSeek);
    this.on(doc, 'mouseup', this.handleMouseUp);
    this.on(doc, 'touchend', this.handleMouseUp);
  }
  handleMouseUp(event) {
    const doc = this.el_.ownerDocument;
    const seekBar = this.getChild('DvrSeekBar');

    if (seekBar) {
      seekBar.handleMouseUp(event);
    }

    this.off(doc, 'mousemove', this.throttledHandleMouseSeek);
    this.off(doc, 'touchmove', this.throttledHandleMouseSeek);
    this.off(doc, 'mouseup', this.handleMouseUp);
    this.off(doc, 'touchend', this.handleMouseUp);
  }

}

DvrProgressControl.prototype.options_ = {
  children: ['DvrSeekBar']
};

videojs.registerComponent('DvrProgressControl', DvrProgressControl);
export default DvrProgressControl;
