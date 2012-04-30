var repo = require('./repository').getInstance(),
    Storage = require('./storage/couchStorage');

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
 * @param {Boolean} Let it true if snapshots should be skipped.
 * @param {Function} Callback function to be triggered when ready.
 */
View.prototype.build = function(reload, callback) {
  var self = this;

  if(typeof reload == 'function') {
    callback = reload,
    reload = false
  }

  if(!this.snapshots || reload) {
    this._loadEvents(callback);
    return;
  }

  this.load(function(data) {
    self._loadEvents(callback);
  })
}

View.prototype._loadEvents = function(callback) {
  var self = this;

  repo.getEventsByName(self.eventNames, self.lastEvent + 1, function(events) { 
    var count = events.length;

    var next = function() {
      var event = events.shift();
      
      if(event) {
        self.apply(event, next);
      } else {
        self._updateSnapshot(count);
        if(callback) callback.call(self);
      }
    };

    next();
  });
};

View.prototype._updateSnapshot = function(count) {
  var storage = Storage.createStorage();

  if(count > 0 && this.snapshots) {
    storage.purgeView(this.uid);
    storage.storeView(this);
  }
}

View.prototype.load = function(callback) {
  var self = this,
      storage = Storage.createStorage();

  storage.loadView(this.uid, function(data) {
    if(data) {
      self.data = data.data;
      self.lastEvent = data.lastEvent
    }

    if(callback) callback(data);
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