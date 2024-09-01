// ==UserScript==
// @name         interval & timeout logger
// @author       mahdi1337
// @run-at       document-start
// ==/UserScript==

window.intervals = [];
window.timeouts = [];

window.activeIntervals = [];
window.activeTimeouts = [];

window.deadIntervals = [];
window.deadTimeouts = [];


const originalSetInterval = window.setInterval;
const originalSetTimeout = window.setTimeout;

const originalClearInterval = window.clearInterval;
const originalClearTimeout = window.clearTimeout;


window.setInterval = function(callback, delay, ...args) {
    const intervalId = originalSetInterval(callback, delay, ...args);
    const intervalObj = {
        id: intervalId,
        callback: callback,
        delay: delay,
        args: args,
        cleared: false
    };
    window.intervals.push(intervalObj);
    window.activeIntervals.push(intervalObj);
    return intervalId;
};

window.setTimeout = function(callback, delay, ...args) {
    const timeoutId = originalSetTimeout(callback, delay, ...args);
    const timeoutObj = {
        id: timeoutId,
        callback: callback,
        delay: delay,
        args: args,
        cleared: false
    };
    window.timeouts.push(timeoutObj);
    window.activeTimeouts.push(timeoutObj);
    return timeoutId;
};

window.clearInterval = function(intervalId) {
    originalClearInterval(intervalId);
    const intervalIndex = window.activeIntervals.findIndex(interval => interval.id === intervalId);
    if (intervalIndex > -1) {
        const intervalObj = window.activeIntervals.splice(intervalIndex, 1)[0];
        intervalObj.cleared = true;
        window.deadIntervals.push(intervalObj);
    }
};

window.clearTimeout = function(timeoutId) {
    originalClearTimeout(timeoutId);
    const timeoutIndex = window.activeTimeouts.findIndex(timeout => timeout.id === timeoutId);
    if (timeoutIndex > -1) {
        const timeoutObj = window.activeTimeouts.splice(timeoutIndex, 1)[0];
        timeoutObj.cleared = true;
        window.deadTimeouts.push(timeoutObj);
    }
};
