var db = require('./storage');
var Event = require('./event');

module.exports = EventBus = function() {}

/*
 * Store new event to event bus.
 *
 * @param {String} Name of event.
 * @param {Number} Unique identifier of aggregate which is the event related to.
 * @param {Object} Additional attributes required to apply event.
 */
EventBus.prototype.save = function( eventName, aggregateId, attributes ) {
  var event = new Event({
    name: eventName,
    aggregateId: aggregateId,
    attributes: attributes
  });
  event.save();
}

EventBus.prototype.getEventBefore = function( aggregateId, beforeEventId, callback ) {
  Event.getEventBefore( aggregateId, beforeEventId, callback );
}

EventBus.prototype.storeSnapshot = function( aggregateId, lastEventId, snapshot, callback ) {
  db.storeSnapshot( aggregateId, lastEventId, snapshot, callback );
}

EventBus.prototype.loadData = function( aggregateId, callback ) {
  db.loadData( aggregateId, callback );
}