import videojs from 'video.js';
import {getDuration, isLive} from '../../../../utils';

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
      const seekTime = isLive(this.player_) ? seekBarPoint * duration - duration : seekBarPoint * duration;
      let content = videojs.formatTime(Math.abs(seekTime));

      if (isLive(this.player_) &&  Math.abs(seekTime) <= MIN_LIVE_DELAY) {
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