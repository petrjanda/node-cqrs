var repo = require('./repository').getInstance();

/*
 * View is the ultimate way, how to look on your data, wider then the scope
 * of one aggregate. Views take various sets of events, found by type, and
 * compose output data report, to be used as DTO for a client. Its major
 * purpose is to decompose and normalize data from the event stream, so
 * the view queries can run with blazingly fast performance, with no need
 * for additional expensive queries to the database.
 *
 * ## View system architecture
 *
 * The view data itself should be kept in content property. Once the content
 * property is requested, system automatically recognize the action and ask the
 * view storage for current snapshot. Once the data is ready the view might or 
 * might not ask for new updates from event stream, apply new events and update 
 * the content. As soon as the last step is done, new snapshot is made and
 * stored back to the view database, to optimize query performance. All the 
 * snapshooting action is happening in parallel with read operations, or even
 * with other snapshot generators, thus there can be multiple versions of
 * your data in the system (for a reasonably short period).
 *
 * @param {String|Array} Event, or list of events the view is interested in.
 * @param {Function} Callback to be triggered when view data is loaded to
 *   the memory.
 */
module.exports = View = function(events) {
  this.events = events;
  this.content = '';
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