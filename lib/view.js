var repo = require('./repository').getInstance();

/*
 * View is the ultimate way, how to look on your data, wider then the scope
 * of one aggregate. Views take various sets of events, found by type, and
 * compose output data report, to be used as DTO for a client. Its major
 * purpose is to decompose and normalize data from the event stream, so
 * the view queries can run with blazingly fast performance, with no need
 * for additional expensive queries to the database.
 *
 * @param {String|Array} Event, or list of events the view is interested in.
 * @param {Function} Callback to be triggered when view data is loaded to
 *   the memory.
 */
module.exports = View = function(events) {
var self = this;  
this.events = events;
}

View.prototype.load = function(callback) {
  var self = this;

  repo.getEventsByName(this.events, function(events) {

    // Apply all loaded events to update aggregate to most recent known state.   
    for(var i = 0; i < events.length; i++) {
      self.apply(events[i]);
    }

    if(callback) {
      callback.call(self);
    }
  });
}

// DRY - refactor apply methods from aggregate and view to common place.
View.prototype.apply = function(event) {
  var name = event.name.charAt(0).toUpperCase() + event.name.slice(1),
      handler = this['on' + name];

  if(typeof handler != 'function') {
    throw new Error('There is no handler for \'' + name + '\' event!');
  }

  handler.call(this, event);
}