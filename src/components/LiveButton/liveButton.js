import videojs from 'video.js';
import {getSeekRange, buildTimeString, behindLiveTime} from '../../utils';

const Component = videojs.getComponent('Component');
const SHOW_LIVE_MAX = 15;

class LiveButton extends Component {
  constructor(player, options) {
    super(player, options);

    this.on('click', this.clicked);
    this.setInterval(this.update, 125);
  }

  createEl() {
    return videojs.dom.createEl('div', {
      id: 'dvr-current-time',
      className: 'vjs-current-time-display',
      innerHTML: '0:00'
    });
  }

  clicked() {
    // Jump to live
    player.currentTime(getSeekRange(this.player()).end);
  }

  update() {
    const seekRange = getSeekRange(player);
    const showHour = (seekRange.end - seekRange.start) >= 3600;
    const displayTime = behindLiveTime(this.player());

    // Consider "LIVE" when less than 15 second behind the live-edge.  Always
    // show the full time string when seeking, including the leading '-';
    // otherwise, the time string "flickers" near the live-edge.
    if (displayTime >= SHOW_LIVE_MAX) {
      this.el().innerHTML = `- ${buildTimeString(displayTime, showHour)}`;
    } else {
      this.el().innerHTML = this.localize('LIVE');
    }
  }
}

videojs.registerComponent('LiveButton', LiveButton);
export default LiveButton;
