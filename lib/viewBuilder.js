/**
  Module dependencies.
*/
var util = require('util'),
    repo = require('./repository').getInstance(),
    View = require('./view'),
    Storage = require('./storage/couchStorage');

/**
  View builder is the class responsible for data denormalization for particular
  view. Its inherits from its basic class for read-only access to its snapshots
  extending it with set of functions, necessary for successful events decomposition.

  @param {String} Unique view identifier.
  @param {Array} List of events view is interested in.
*/
module.exports = ViewBuilder = function(uid, eventNames) {

  this.snapshots = true;

  View.call(this, uid, eventNames);
}

util.inherits(ViewBuilder, View);

/**
  Load the view data from the storage. The most recent snapshot is searched
  along with events, which are newer, thus should be applied to get most up
  to date data.

  @param {Boolean} Let it true if snapshots should be skipped.
  @param {Function} Callback function to be triggered when ready.
*/
ViewBuilder.prototype.build = function(reload, callback) {
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

/**
  Apply given event to the view.

  @param {Object} Event object.
  @param {Function} Callback function.
  @return {Void}
*/
// DRY - refactor apply methods from aggregate and view to common place.
ViewBuilder.prototype.apply = function(event, callback) {
  var name = event.name.charAt(0).toUpperCase() + event.name.slice(1),
      handler = this['on' + name];

  if(typeof handler != 'function') {
    throw new Error('There is no handler for \'' + name + '\' event!');
  }

  this.lastEvent = event.time;

  handler.call(this, event, callback);
}

/**
  Update the snapshot with view data.

  @param {Number} Number of messages since last snapshot.
  @private
*/
ViewBuilder.prototype._updateSnapshot = function(count) {
  var storage = Storage.createStorage();

  if(count > 0 && this.snapshots) {
    storage.purgeView(this.uid);
    storage.storeView(this);
  }
}

/**
  Load events increment for the view until the last snapshot was taken. If
  no snapshot exists, all the events are fetched.

  @param {Function} Callback function accepting view as binding.
*/
ViewBuilder.prototype._loadEvents = function(callback) {
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