let isEnabled = false;

const debug = function() {
  if (isEnabled) {
    let args = Array.prototype.slice.call(arguments)
    args.unshift('[' + (new Date()).toISOString().substr(11, 12) + ' :: DVRSeekBar plugin]');
    console.log.apply(console, args);
  }
};

debug.enable = function(enabled) {
  isEnabled = enabled;
};

export default debug;
