var repo = require('./repository').getInstance();

module.exports = View = function(event, callback) {
  var self = this;
  
  repo.getEventsByName(event, function(events) {

    // Apply all loaded events to update aggregate to most recent known state.   
    for(var i = 0; i < events.length; i++) {
      self.apply(events[i]);
    }

    if(callback) {
      callback.call(self);
    }
  });
}

View.prototype.apply = function(event) {
  var name = event.name.charAt(0).toUpperCase() + event.name.slice(1),
      handler = this['on' + name];

  if(typeof handler != 'function') {
    throw new Error('There is no handler for \'' + name + '\' event!');
  }

  handler.call(this, event);
}