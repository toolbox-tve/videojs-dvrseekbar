import videojs from 'video.js';
import {getDuration} from '../../../../utils';

const MouseTimeDisplay = videojs.getComponent('MouseTimeDisplay');
const MIN_LIVE_DELAY = 15;

class DvrMouseTimeDisplay extends MouseTimeDisplay {
  update(seekBarRect, seekBarPoint) {
    // If there is an existing rAF ID, cancel it so we don't over-queue.
    if (this.rafId_) {
      this.cancelAnimationFrame(this.rafId_);
    }

    this.rafId_ = this.requestAnimationFrame(() => {
      const duration = getDuration(this.player_);
      const seekTime = this.player_.duration() === Infinity ? seekBarPoint * duration - duration : seekBarPoint * duration;
      let content = videojs.formatTime(Math.abs(seekTime));

      if (this.player_.duration() === Infinity &&  Math.abs(seekTime) <= MIN_LIVE_DELAY) {
        content = this.localize('LIVE');
      } else if (seekTime < 0) {
        content = `-${content}`;
      }

      this.el_.style.left = `${seekBarRect.width * seekBarPoint}px`;
      this.getChild('timeTooltip').update(seekBarRect, seekBarPoint, content);
    });
  }
}

videojs.registerComponent('DvrMouseTimeDisplay', DvrMouseTimeDisplay);
export default DvrMouseTimeDisplay;