const EventEmitter = require('events');
const { removeAllListeners } = require('process');

class MessageEmitter extends EventEmitter {

    
  destroy(err) {
    removeAllListeners()
  }
}