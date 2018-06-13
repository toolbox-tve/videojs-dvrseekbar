class DVRSeekBar {
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
      //this.video_.addEventListener('playing', this.onFlowModePlaying_.bind(this));
    }
  }

  getEl() {
    return this.dvrSeekBar_;
  }

  /** @private */
  onSeekStart_() {
    if (!this.enabled_) return;

    this.isSeeking_ = true;
    this.video_.pause();
  }

  /** @private */
  onSeekInput_() {
    if (!this.enabled_) return;

    if (!this.video_.duration) {
      // Can't seek yet.  Ignore.
      return;
    }

    // Update the UI right away.
    this.updateTimeAndSeekRange_();

    // Collect input events and seek when things have been stable for 125ms.
    if (this.seekTimeoutId_ != null) {
      window.clearTimeout(this.seekTimeoutId_);
    }
    this.seekTimeoutId_ = window.setTimeout(
      this.onSeekInputTimeout_.bind(this),
      125
    );
  }

  /** @private */
  onSeekInputTimeout_() {
    let seekVal = parseFloat(this.dvrSeekBar_.value);
    let lastStartPoint = this.getSeekRange().start;

    this.dvrSeekBar_.min = lastStartPoint;
    this.seekTimeoutId_ = null;
    //TODO: Hack para evitar que se cuelgue al cambiarse el starter point mientras es en vivo:
    this.video_.currentTime =
      seekVal <= lastStartPoint ? lastStartPoint + 30 : seekVal;
  }

  /** @private */
  onSeekEnd_() {
    if (!this.enabled_) return;

    if (this.seekTimeoutId_ != null) {
      // They just let go of the seek bar, so end the timer early.
      window.clearTimeout(this.seekTimeoutId_);
      this.onSeekInputTimeout_();
    }

    this.isSeeking_ = false;
    this.video_.play();
  }

  /** @private */
  onCurrentTimeClick_() {
    if (!this.enabled_) return;

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
  onFlowModePlaying_(e) {
    if (this.player_.isLive()) {
      this.video_.currentTime = this.getSeekRange().start + 30;
    }
  }

	/**
  * @param {Event} event
  * @private
  */
  onBufferingStateChange_(event) {
    //this.bufferingSpinner_.style.display =
    //    event.buffering ? 'inherit' : 'none';
  }

	/**
  * @return {boolean}
  * @private
  */
  isOpaque_() {
    if (!this.enabled_) return false;

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
    var h = Math.floor(displayTime / 3600);
    var m = Math.floor((displayTime / 60) % 60);
    var s = Math.floor(displayTime % 60);
    if (s < 10) s = '0' + s;
    var text = m + ':' + s;
    if (showHour) {
      if (m < 10) text = '0' + text;
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

    let seekRange = this.getSeekRange();
    // Suppress updates if seekable range are not loaded.
    if (seekRange.end === 0 && seekRange.start === seekRange.end) {
      return;
    }

    this.dvrSeekBar_.min = seekRange.start;
    this.dvrSeekBar_.max = seekRange.end;

    let seekRangeSize = this.getMediaSeekRangeSize_();
    let displayTime = this.isSeeking_
      ? this.dvrSeekBar_.value
      : this.video_.currentTime;
    let duration = this.video_.duration;
    let bufferedLength = this.video_.buffered.length;
    let bufferedStart = bufferedLength ? this.video_.buffered.start(0) : 0;
    let bufferedEnd = bufferedLength
      ? this.video_.buffered.end(bufferedLength - 1)
      : 0;

    if (this.player_.isLive && this.player_.isLive()) {
      // The amount of time we are behind the live edge.
      let behindLive = Math.floor(seekRange.end - displayTime);
      displayTime = Math.max(0, behindLive);

      let showHour = seekRangeSize >= 3600;

      // Consider "LIVE" when less than 1 second behind the live-edge.  Always
      // show the full time string when seeking, including the leading '-';
      // otherwise, the time string "flickers" near the live-edge.
      if (displayTime >= 15 || this.isSeeking_) {
        // Si es con experiencia Flow:
        if (this.options_.flowMode) {
          if (!this.firstSeekRangeStart) {
            //player.vjsPlayer.currentTime(seekRange.start);
          }
          // Fill firstSeekRangeStart
          if (this.isSeeking_ || !this.firstSeekRangeStart) {
            this.firstSeekRangeStart = seekRange.start;
          }

          this.currentTime_.textContent = this.buildTimeString_(
            this.video_.currentTime - this.firstSeekRangeStart,
            showHour
          );
          console.log(
            `SeekRangeStart: ${seekRange.start} | SeekRangeEnd: ${seekRange.end} | CurrentTime: ${this
              .video_
              .currentTime} | DisplayTime: ${displayTime} | SeekSize: ${seekRangeSize} | Time: ${this
                .currentTime_.textContent}`
          );
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
      var showHour = duration >= 3600;

      this.currentTime_.textContent = this.buildTimeString_(
        displayTime,
        showHour
      );

      if (!this.isSeeking_) {
        this.dvrSeekBar_.value = displayTime;
      }

      this.currentTime_.style.cursor = '';
    }

    let gradient = ['to right'];
    if (bufferedLength == 0) {
      gradient.push('#000 0%');
    } else {
      var clampedBufferStart = Math.max(bufferedStart, seekRange.start);
      var clampedBufferEnd = Math.min(bufferedEnd, seekRange.end);

      var bufferStartDistance = clampedBufferStart - seekRange.start;
      var bufferEndDistance = clampedBufferEnd - seekRange.start;
      var playheadDistance = displayTime - seekRange.start;

      // NOTE: the fallback to zero eliminates NaN.
      var bufferStartFraction = bufferStartDistance / seekRangeSize || 0;
      var bufferEndFraction = bufferEndDistance / seekRangeSize || 0;
      var playheadFraction = playheadDistance / seekRangeSize || 0;

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
/////////////////////////
