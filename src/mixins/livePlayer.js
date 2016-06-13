const livePlayerMixin = {

  playOnAir: function() {
    debug('Play last seekable moment: ' + player.seekable().end(0));
    //this.player_.currentTime(player.seekable().end(0));
    //this.player_.play();
  },

  isStreamingOnAir: function(onAirTolerance) {
    const time = this.player_.seekable();

    // When any tech is disposed videojs will trigger a 'timeupdate' event
    // when calling stopTrackingCurrentTime(). If the tech does not have
    // a seekable() method, time will be undefined
    if (!time || !time.length) {
      debug('isStreamingOnAir: no time ranges');

      // If no time ranges yet, assume yes
      return true;
    }

    // TODO: fix this
    const lastSeekableMoment = time.end(0);

    //debug('isStreamingOnAir: lastSeekableMoment = ' + lastSeekableMoment);
    debug('isStreamingOnAir: player.currentTime() = ' + this.player_.currentTime());
    debug('isStreamingOnAir: difference = ' + String(lastSeekableMoment - this.player_.currentTime()));
    const onAir = (lastSeekableMoment - this.player_.currentTime()) < onAirTolerance;

    return onAir;
  }

};

export default livePlayerMixin;
