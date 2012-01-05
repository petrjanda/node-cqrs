var db = require('./couchDb').getInstance();

module.exports = View = function(event, callback) {
  var self = this;
  
  db.getEventsByType(event, function(events) {

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
  
}