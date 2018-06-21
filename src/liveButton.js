import document from 'global/document';

class LiveButton {
  constructor() {
    this.dvrCurrentTime = document.createElement('div');
    this.dvrCurrentTime.setAttribute('id', 'dvr-current-time');
    this.dvrCurrentTime.innerHTML = '0:00';
    this.dvrCurrentTime.className = 'vjs-current-time-display';
  }

  /**
   *
   *
   * @memberof LiveButton
   */
  getEl() {
    return this.dvrCurrentTime;
  }
}

export default LiveButton;
