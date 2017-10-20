'use strict';
/**
 * Utilities
 * 
 * @file utils.js
 * @module utils
 */

/**
  * Builds a time string, e.g., 01:04:23, from |displayTime|.
  *
  * @param {number} displayTime
  * @param {boolean} showHour
  * @return {string}
  * @private
  */
  export const buildTimeString = (displayTime, showHour) => {
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
