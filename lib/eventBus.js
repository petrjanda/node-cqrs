var CouchDb = require('./couchdb');

module.exports = EventBus = {

  eventHandlers: {},

  registerHandler: function( events, callback ) {

    if( typeof events == 'string' ) {
      events = [ events ];
    }

    for( var i = 0; i < events.length; i++ ) {
      var list = this.eventHandlers[ events[i] ] || [];
      list.push( callback );
      this.eventHandlers[ events[i] ] = list;
    }
  },

  /*
   * Store new event to event bus.
   *
   * @param {String} Name of event.
   * @param {Number} Unique identifier of aggregate which is the event related to.
   * @param {Object} Additional attributes required to apply event.
   */
  storeEvent: function( name, aggregateId, attributes ) {
    var db = new CouchDb();
    var event = {
      name: name, 
      aggregateId: aggregateId, 
      attributes: attributes 
    };

    db.storeEvent( aggregateId, name, attributes );

    if( this.eventHandlers[name] ) {
      for( var i = 0; i < this.eventHandlers[name].length; i++ ) {
        this.eventHandlers[name][i](event)
      }
    }
  },

  storeSnapshot: function( aggregateId, lastEventId, snapshot, callback ) {
    db.storeSnapshot( aggregateId, lastEventId, snapshot, callback );
  },

  loadData: function( aggregateId, callback ) {
    var db = new CouchDb();
    db.getEventsByAggregate( aggregateId, function(data) {
      var data = JSON.parse(data),
      events = []

      for(var i = 0; i < data.rows.length; i++) {
        events.push(data.rows[i].value);
      }
      
      callback(null, events, null);
    } );
  }  
}