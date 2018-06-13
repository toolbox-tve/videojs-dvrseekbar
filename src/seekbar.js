import window from 'global/window';
import document from 'global/document';

/**
 * DVR Seekbar class
 *
 * @class DVRSeekBar
 */
class DVRSeekBar {
  /**
   * Creates an instance of DVRSeekBar.
   *
   * @param {*} player videojs instance
   * @param {*} options dvrseekbar plugin options
   * @memberof DVRSeekBar
   */
  constructor(player, options) {
    if (!options) {
      options = {};
    }

    this.vjsPlayer_ = player;
    this.options_ = options;

    if (this.vjsPlayer_.dash && this.vjsPlayer_.dash.shakaPlayer) {
      this.player_ = this.vjsPlayer_.dash.shakaPlayer;
      this.player_.addEventListener(
        'buffering',
        this.onBufferingStateChange_.bind(this)
      );
      // window.setInterval(this.updateTimeAndSeekRange_.bind(this), 125);
    } else {
      this.player_ = this.vjsPlayer_;
    }

    window.setInterval(this.updateTimeAndSeekRange_.bind(this), 125);

    /** @private {HTMLMediaElement} */
    this.video_ = this.vjsPlayer_.tech_.el_;
    /** @private {boolean} */
    this.enabled_ = true;
    /** @private {?number} */
    this.seekTimeoutId_ = null;

    const seekBarEl = document.createElement('input');

    seekBarEl.setAttribute('type', 'range');
    seekBarEl.setAttribute('step', 'any');
    seekBarEl.setAttribute('min', '0');
    seekBarEl.setAttribute('max', '1');
    seekBarEl.setAttribute('value', '0');
    seekBarEl.setAttribute('id', 'seekBar');

    seekBarEl.addEventListener('mousedown', this.onSeekStart_.bind(this));
    seekBarEl.addEventListener('touchstart', this.onSeekStart_.bind(this), {
      passive: true
    });
    seekBarEl.addEventListener('input', this.onSeekInput_.bind(this));
    seekBarEl.addEventListener('touchend', this.onSeekEnd_.bind(this));
    seekBarEl.addEventListener('mouseup', this.onSeekEnd_.bind(this));

    this.dvrSeekBar_ = seekBarEl;

    this.currentTime_ = document.getElementById('dvr-current-time');
    this.currentTime_.addEventListener(
      'click',
      this.onCurrentTimeClick_.bind(this)
    );

    this.firstSeekRangeStart = null;

    if (options.flowMode) {
      // this.video_.addEventListener('playing', this.onFlowModePlaying_.bind(this));
    }
  }

  /**
   * Get dvrseekbar element
   *
   * @return {Element} dvrseekbar element
   * @memberof DVRSeekBar
   */
  getEl() {
    return this.dvrSeekBar_;
  }

  /**
   * Called on seek start
   *
   * @memberof DVRSeekBar
   */
  onSeekStart_() {
    if (!this.enabled_) {
      return;
    }

    this.isSeeking_ = true;
    this.video_.pause();
  }

  /**
   * Called on seek input
   *
   * @memberof DVRSeekBar
   */
  onSeekInput_() {
    if (!this.enabled_) {
      return;
    }

    if (!this.video_.duration) {
      // Can't seek yet.  Ignore.
      return;
    }

    // Update the UI right away.
    this.updateTimeAndSeekRange_();

    // Collect input events and seek when things have been stable for 125ms.
    if (this.seekTimeoutId_ !== null) {
      window.clearTimeout(this.seekTimeoutId_);
    }
    this.seekTimeoutId_ = window.setTimeout(
      this.onSeekInputTimeout_.bind(this),
      125
    );
  }

  /**
   * Seek input timeout
   *
   * @memberof DVRSeekBar
   */
  onSeekInputTimeout_() {
    const seekVal = parseFloat(this.dvrSeekBar_.value);
    const lastStartPoint = this.getSeekRange().start;

    this.dvrSeekBar_.min = lastStartPoint;
    this.seekTimeoutId_ = null;
    // TODO: Hack para evitar que se cuelgue al cambiarse
    // el starter point mientras es en vivo:
    this.video_.currentTime =
      seekVal <= lastStartPoint ? lastStartPoint + 30 : seekVal;
  }

  /**
   * Called on seek end
   *
   * @memberof DVRSeekBar
   */
  onSeekEnd_() {
    if (!this.enabled_) {
      return;
    }

    if (this.seekTimeoutId_ !== null) {
      // They just let go of the seek bar, so end the timer early.
      window.clearTimeout(this.seekTimeoutId_);
      this.onSeekInputTimeout_();
    }

    this.isSeeking_ = false;
    this.video_.play();
  }

  /**
   * Called onCurrentTimeClick
   *
   * @memberof DVRSeekBar
   */
  onCurrentTimeClick_() {
    if (!this.enabled_) {
      return;
    }

    // Jump to LIVE if the user clicks on the current time.
    if (this.player_.isLive && this.player_.isLive()) {
      this.video_.currentTime = this.dvrSeekBar_.max;
    }
  }

	/**
   * Iniciar desde el comienzo el contenido live
   * con FlowMode activado.
   *
   * @memberof DVRSeekBar
   */
  onFlowModePlaying_() {
    if (this.player_.isLive()) {
      this.video_.currentTime = this.getSeekRange().start + 30;
    }
  }

	/**
   * Called when buffering state changes
   *
   * @param {*} event event
   * @memberof DVRSeekBar
   */
  onBufferingStateChange_(event) {
    // this.bufferingSpinner_.style.display = event.buffering ? 'inherit' : 'none';
  }

	/**
   * Returns if dvrseekbar is enabled or not
   *
   * @return {boolean} true or false
   * @memberof DVRSeekBar
   */
  isOpaque_() {
    if (!this.enabled_) {
      return false;
    }

    return this.vjsPlayer_.userActive();
  }

	/**
  * @return {number}
  * @private
  */
  getMediaSeekRangeSize_() {
    return this.getSeekRange().end - this.getSeekRange().start;
  }

	/**
  * Builds a time string, e.g., 01:04:23, from |displayTime|.
  *
  * @param {number} displayTime
  * @param {boolean} showHour
  * @return {string}
  * @private
  */
  buildTimeString_(displayTime, showHour) {
    const h = Math.floor(displayTime / 3600);
    const m = Math.floor((displayTime / 60) % 60);
    let s = Math.floor(displayTime % 60);

    if (s < 10) {
      s = '0' + s;
    }

    let text = m + ':' + s;

    if (showHour) {
      if (m < 10) {
        text = '0' + text;
      }
      text = h + ':' + text;
    }
    return text;
  }

	/**
  * Called when the seek range or current time need to be updated.
  * @private
  * @memberof DVRSeekBar
  */
  updateTimeAndSeekRange_() {
    // Suppress updates if the controls are hidden.
    if (!this.isOpaque_()) {
      return;
    }

    const seekRange = this.getSeekRange();

    // Suppress updates if seekable range are not loaded.
    if (seekRange.end === 0 && seekRange.start === seekRange.end) {
      return;
    }

    this.dvrSeekBar_.min = seekRange.start;
    this.dvrSeekBar_.max = seekRange.end;

    const seekRangeSize = this.getMediaSeekRangeSize_();
    const duration = this.video_.duration;
    const bufferedLength = this.video_.buffered.length;
    const bufferedStart = bufferedLength ? this.video_.buffered.start(0) : 0;
    const bufferedEnd = bufferedLength ? this.video_.buffered.end(bufferedLength - 1) : 0;
    let displayTime = this.isSeeking_ ? this.dvrSeekBar_.value : this.video_.currentTime;

    if (this.player_.isLive && this.player_.isLive()) {
      // The amount of time we are behind the live edge.
      const behindLive = Math.floor(seekRange.end - displayTime);
      const showHour = seekRangeSize >= 3600;

      displayTime = Math.max(0, behindLive);

      // Consider "LIVE" when less than 1 second behind the live-edge.  Always
      // show the full time string when seeking, including the leading '-';
      // otherwise, the time string "flickers" near the live-edge.
      if (displayTime >= 15 || this.isSeeking_) {
        // Si es con experiencia Flow:
        if (this.options_.flowMode) {
          if (!this.firstSeekRangeStart) {
            // player.vjsPlayer.currentTime(seekRange.start);
          }
          // Fill firstSeekRangeStart
          if (this.isSeeking_ || !this.firstSeekRangeStart) {
            this.firstSeekRangeStart = seekRange.start;
          }

          this.currentTime_.textContent = this.buildTimeString_(
            this.video_.currentTime - this.firstSeekRangeStart,
            showHour
          );

          /* console.log(
            `SeekRangeStart: ${seekRange.start} | SeekRangeEnd: ${seekRange.end} | CurrentTime: ${this
              .video_
              .currentTime} | DisplayTime: ${displayTime} | SeekSize: ${seekRangeSize} | Time: ${this
                .currentTime_.textContent}`
          ); */
        } else {
          this.currentTime_.textContent =
            '- ' + this.buildTimeString_(displayTime, showHour);
        }

        this.currentTime_.style.cursor = 'pointer';
      } else {
        this.currentTime_.textContent = 'LIVE';
        this.currentTime_.style.cursor = '';
      }

      if (!this.isSeeking_) {
        this.dvrSeekBar_.value = seekRange.end - displayTime;
      }
    } else {
      const showHour = duration >= 3600;

      this.currentTime_.textContent = this.buildTimeString_(
        displayTime,
        showHour
      );

      if (!this.isSeeking_) {
        this.dvrSeekBar_.value = displayTime;
      }

      this.currentTime_.style.cursor = '';
    }

    const gradient = ['to right'];

    if (bufferedLength === 0) {
      gradient.push('#000 0%');
    } else {
      const clampedBufferStart = Math.max(bufferedStart, seekRange.start);
      const clampedBufferEnd = Math.min(bufferedEnd, seekRange.end);

      const bufferStartDistance = clampedBufferStart - seekRange.start;
      const bufferEndDistance = clampedBufferEnd - seekRange.start;
      const playheadDistance = displayTime - seekRange.start;

      // NOTE: the fallback to zero eliminates NaN.
      const bufferStartFraction = bufferStartDistance / seekRangeSize || 0;
      const bufferEndFraction = bufferEndDistance / seekRangeSize || 0;
      const playheadFraction = playheadDistance / seekRangeSize || 0;

      gradient.push('#000 ' + bufferStartFraction * 100 + '%');
      gradient.push('#ccc ' + bufferStartFraction * 100 + '%');
      gradient.push('#ccc ' + playheadFraction * 100 + '%');
      gradient.push('#444 ' + playheadFraction * 100 + '%');
      gradient.push('#444 ' + bufferEndFraction * 100 + '%');
      gradient.push('#000 ' + bufferEndFraction * 100 + '%');
    }
		/* this.dvrSeekBar_.style.background =
			'linear-gradient(' + gradient.join(',') + ')'; */
  }

  getSeekRange() {
    if (this.player_.seekRange) {
      return this.player_.seekRange();
    }
    return {
      start: this.player_.seekable().start(0),
      end: this.player_.seekable().end(0)
    };
  }
}

export default DVRSeekBar;
