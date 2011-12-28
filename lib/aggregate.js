var EventBus = require('./eventBus');

/*
 * Aggregate is the cluster of system entities and value objects use to maintain
 * transactional consistency. It encapsulate set of specific set of objects
 * which should keep consistent and keep business driven set of invariants.
 *
 * @param {Number} Unique system aggregate identifier.
 */
module.exports = Aggregate = function( id, callback ) {
  var self = this;
  this._id = id;

  // Load data from the event storage.
  EventBus.loadData( this._id, function(snapshot, events, lastEventId) {

    // If any snapshot had been found, we use it to initialize object state.
    if( snapshot ) {
      self.init(snapshot);  
    }
 
    // Apply all loaded events to update aggregate to most recent known state.   
    for(var i = 0; i < events.length; i++) {
      self.apply(events[i]);
    }

    // Store created snapshot back to the event bus as the most recent known
    // state of the object.
    EventBus.storeSnapshot(self._id, lastEventId, self.snapshot());

    if(callback)
      callback.call(self);
  });
}

/*
 * Initialize aggregate state using the data specified in a snapshot.
 *
 * @param {Object} Snapshot data.
 * @return {Void}
 */
Aggregate.prototype.init = function(data) { console.log("INIT"); }

/*
 * Return snapshot of aggregate current state. 
 *
 * @return {Object} Object containing all necessary attributes to reinitialize
 *                  aggregate current state.
 */
Aggregate.prototype.snapshot = function() { return {}; }

/*
 * Apply given event to the aggregate in order to update its status.
 *
 * @param {Object} Event object.
 * @return {Void}
 */
Aggregate.prototype.apply = function(event) {}

/*
 * In case the aggregate need to store any information about action taken, it
 * emits an event, which contains necessary event information.
 *
 * @param {Object} Event to be emited to event bus.
 * @return {Void}
 */
Aggregate.prototype.emit = function(name, attributes) {
  EventBus.storeEvent(name, this._id, attributes);
}