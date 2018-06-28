import videojs from 'video.js';
import {getDuration, getSeekRange} from '../../../utils';

import './DvrMouseTimeDisplay/DvrMouseTimeDisplay';

const SeekBar = videojs.getComponent('SeekBar');

class DvrSeekBar extends SeekBar {
  update_(currentTime, percent) {
    const duration = getDuration(this.player_);

    // machine readable value of progress bar (percentage complete)
    this.el_.setAttribute('aria-valuenow', (percent * 100).toFixed(2));

    // human readable value of progress bar (time complete)
    this.el_.setAttribute('aria-valuetext',
      this.localize('progress bar timing: currentTime={1} duration={2}',
        [videojs.formatTime(currentTime, duration),
        videojs.formatTime(duration, duration)],
        '{1} of {2}'));

    // Update the `PlayProgressBar`.
    this.bar.update(videojs.dom.getBoundingClientRect(this.el_), percent);
  }

  handleMouseMove(event) {
    if (!videojs.dom.isSingleLeftClick(event)) {
      return;
    }

    const startTime = getSeekRange(this.player_).start;
    const duration = getDuration(this.player_);
    let newTime = this.calculateDistance(event) * duration + startTime;

    // Don't let video end while scrubbing.
    if (newTime === duration) {
      newTime = newTime - 0.1;
    }

    // Set new time (tell player to seek to new time)
    this.player_.currentTime(newTime);
  }

  getPercent() {
    const duration = getDuration(this.player_);
    const startTime = getSeekRange(this.player_).start;
    const currentTime = this.getCurrentTime_() - startTime;
    const percent = currentTime / duration;
    return percent >= 1 ? 1 : (percent || 0);
  }
}

DvrSeekBar.prototype.options_ = {
  children: [
    'loadProgressBar',
    'playProgressBar'
  ],
  barName: 'playProgressBar'
};

// MouseTimeDisplay tooltips should not be added to a player on mobile devices
if (!videojs.browser.IS_IOS && !videojs.browser.IS_ANDROID) {
  DvrSeekBar.prototype.options_.children.splice(1, 0, 'DvrMouseTimeDisplay');
}

videojs.registerComponent('DvrSeekBar', DvrSeekBar);
export default DvrSeekBar;