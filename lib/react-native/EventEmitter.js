var EventEmitter = require('../../../react-native/Libraries/vendor/emitter/_EventEmitter');

EventEmitter.prototype.on = EventEmitter.prototype.addListener;
module.exports = EventEmitter;