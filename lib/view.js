var repo = require('./repository').getInstance(),
    storage = require('./storage/couchStorage').getInstance();

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
 * @param {String|Array} Unique view identifier.
 * @param {String|Array} Event, or list of events the view is interested in.
 * @param {Function} Callback to be triggered when view data is loaded to
 *   the memory.
 */
module.exports = View = function(uid, eventNames) {

  // Store view unique id.
  this.uid = uid;

  // List of event names, the view is interested in.
  this.eventNames = eventNames;

  // Data content of the view, used as DTO for client.
  this.data = {};

  this.snapshots = true;

  // Timestamp of last applied event.
  this.lastEvent = 0;
}

/*
 * Load the view data from the storage. The most recent snapshot is searched
 * along with events, which are newer, thus should be applied to get most up
 * to date data.
 *
 * @param {Function} Callback function to be triggered when ready.
 */
View.prototype.load = function(callback) {
  var self = this;
  var start = new Date().getTime(),
      
  loadEvents = function() {
    repo.getEventsByName(self.eventNames, self.lastEvent + 1, function(events) {      
      var next = function() {
        var event = events.pop();
        
        if(event) {
          self.apply(event, next);
        } else {
          if(events.length > 0) {
            storage.storeView(self);
          }

          if(callback) {
            callback.call(self);
          }
        }
      };

      next();
    });
  };

  if(!this.snapshots) {
    loadEvents();
    return;
  }

  storage.loadView(this.uid, function(data) {

    // Apply data, loaded from snapshot.
    if(data) {
      self.data = data.data;
      self.lastEvent = data.lastEvent
    }

    // Update data and lastEvent, load data from repo just for newer events.
    loadEvents();
  })  
}

/*
 * Apply given event to the view.
 *
 * @param {Object} Event object.
 * @param {Function} Callback function.
 * @return {Void}
 */
// DRY - refactor apply methods from aggregate and view to common place.
View.prototype.apply = function(event, callback) {
  var name = event.name.charAt(0).toUpperCase() + event.name.slice(1),
      handler = this['on' + name];

  if(typeof handler != 'function') {
    throw new Error('There is no handler for \'' + name + '\' event!');
  }

  this.lastEvent = event.time;

  handler.call(this, event, callback);
}