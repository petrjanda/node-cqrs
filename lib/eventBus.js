var db = require('./storage');

module.exports = EventBus = {

  /*
   * Store new event to event bus.
   *
   * @param {String} Name of event.
   * @param {Number} Unique identifier of aggregate which is the event related to.
   * @param {Object} Additional attributes required to apply event.
   */
  storeEvent: function( name, aggregateId, attributes ) {
    db.storeEvent({
      name: name,
      aggregateId: aggregateId,
      attributes: attributes
    });
  },

  storeSnapshot: function( aggregateId, lastEventId, snapshot, callback ) {
    db.storeSnapshot( aggregateId, lastEventId, snapshot, callback );
  },

  loadData: function( aggregateId, callback ) {
    db.loadData( aggregateId, callback );
  }  
}