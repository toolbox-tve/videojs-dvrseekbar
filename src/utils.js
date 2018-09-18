export function getSeekRange(player) {
  const shakaPlayer = player && player.tech_ && player.tech_.shakaPlayer;
  if (shakaPlayer && shakaPlayer.seekRange) {
    return shakaPlayer.seekRange();
  } else if (player.seekable && player.seekable().length > 0) {
    return {
      start: player.seekable().start(0),
      end: player.seekable().end(0)
    };
  }
  return {
    start: 0,
    end: player.duration()
  }
}

export function getDuration(player) {
  if (player.duration() === Infinity) {
    const seekRange = getSeekRange(player);
    return seekRange.end - seekRange.start;
  }
  return player.duration();
}

export function behindLiveTime(player) {
  const seekRange = getSeekRange(player);
  // TODO: add when seekbar is Seeking
  const currentTime = player.currentTime();
  const behindLive = Math.floor(seekRange.end - currentTime);
  return Math.max(0, behindLive);
}

/**
  * Builds a time string, e.g., 01:04:23, from |displayTime|.
  *
  * @param {number} displayTime
  * @param {boolean} showHour
  * @return {string}
  * @private
  */
 export function buildTimeString(displayTime, showHour = true) {
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