import videojs from 'video.js';
import debug from '../utils/debug.js';

const SeekBar = videojs.getComponent('SeekBar');

SeekBar.prototype.dvrTotalTime = function(player) {
  let time = player.seekable();

  return time && time.length ? time.end(0) - time.start(0) : 0;
};

SeekBar.prototype.handleMouseMove = function(e) {
  let bufferedTime;
  let newTime;

  bufferedTime = newTime = this.player_.seekable();

  if (bufferedTime && bufferedTime.length) {
    let progress = this.calculateDistance(e) * this.dvrTotalTime(this.player_);

    newTime = bufferedTime.start(0) + progress;
    for (; newTime >= bufferedTime.end(0);) {
      newTime -= 0.1;
    }

    this.player_.currentTime(newTime);
  }
};

SeekBar.prototype.updateAriaAttributes = function() {
  const seekableRanges = this.player_.seekable() || [];

  if (seekableRanges.length) {
    const lastSeekableTime = seekableRanges.end(0);
    const cachedCTime = this.player_.getCache().currentTime;
    const currentTime = this.player_.scrubbing ? cachedCTime : this.player_.currentTime();
    let timeToLastSeekable;

    // Get difference between last seekable moment and current time
    timeToLastSeekable = lastSeekableTime - currentTime;
    if (timeToLastSeekable < 0) {
      timeToLastSeekable = 0;
    }

    // Update current time control
    const formattedTime = videojs.formatTime(timeToLastSeekable, lastSeekableTime);
    const formattedPercentage = Math.round(100 * this.getPercent(), 2);

    this.el_.setAttribute('aria-valuenow', formattedPercentage);
    this.el_.setAttribute('aria-valuetext', (currentTime ? '' : '-') + formattedTime);
  }
};
