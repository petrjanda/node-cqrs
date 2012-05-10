var repo = require('./repository').getInstance(),
    Storage = require('./storage/couchStorage');

/**
  ```View``` is the read data representation in your system. It can represent wide
  range of data well beyond reach of single aggregate. View are denormalized
  and optimized for reading by simple key fetching without need to do additional
  complex manipulation and selections.

  @param {String} Unique view identifier.
  @param {Array} List of events the view is interested in.
*/
module.exports = View = function(uid, eventNames) {

  // Store view unique id.
  this.uid = uid;

  // List of event names, the view is interested in.
  this.eventNames = eventNames;

  // Data content of the view, used as DTO for client.
  this.data = {};

  // Timestamp of last applied event.
  this.lastEvent = 0;
}

/**
  Load the view data from the persistancy, using the latest snapshot. Null data is returned
  if no snapshot is created yet. The load method is exclusively supposed to be used in
  read requests, fetching the data for usage.

  @param {Function} Callback function to be called with view binding.
  @returns null
*/
View.prototype.load = function(callback) {
  var self = this,
      storage = Storage.createStorage();

  storage.loadView(this.uid, function(data) {
    if(data) {
      self.data = data.data;
      self.lastEvent = data.lastEvent
    }

    if(callback) callback.call(self);
  })  
}

