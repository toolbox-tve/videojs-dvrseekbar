import videojs from 'video.js';
const SeekBar = videojs.getComponent('SeekBar');

/**
 * SeekBar with DVR support class
 */
class DVRSeekBar extends SeekBar {

  /** @constructor */
  constructor(player, options) {

    super(player, options);
    this.startTime = options.startTime;
  }

  handleMouseMove(e) {
    let bufferedTime, newTime;

    if (this.player_.duration() < this.player_.currentTime()) {
        this.player_.duration(this.player_.currentTime());
        bufferedTime = this.player_.currentTime() - this.options.startTime;
        newTime = (this.player_.currentTime() - bufferedTime) + (this.calculateDistance(e) * bufferedTime); // only search in buffer

    } else {
        bufferedTime = this.player_.duration() - this.options.startTime;
        newTime = (this.player_.duration() - bufferedTime) + (this.calculateDistance(e) * bufferedTime); // only search in buffer

    }
    if (newTime < this.options.startTime) { // if calculated time was not played once.
        newTime = this.options.startTime;
    }
    // Don't let video end while scrubbing.
    if (newTime === this.player_.duration()) {
        newTime = newTime - 0.1;
    }

    // Set new time (tell player to seek to new time)
    this.player_.currentTime(newTime);
  }

}

export { DVRSeekBar }
