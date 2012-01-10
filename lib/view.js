var repo = require('./repository/couchdb').getInstance();

module.exports = View = function(event, callback) {
  var self = this;
  
  repo.getEventsByType(event, function(events) {

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