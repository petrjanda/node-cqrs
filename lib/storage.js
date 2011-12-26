redis = require('redis');
//redis.debug_mode = true;

module.exports = Storage = function() {
  this.edb = redis.createClient( 6379, '127.0.0.1' );
  //this.edb.auth( '5f217db27a02ed75e2a00ed37e2e7d45' );
}

Storage.prototype.storeSnapshot = function( aggregateId, lastEventId, snapshot, callback ) {
  var transaction = this.edb.multi();
  console.log(JSON.stringify(snapshot))
  transaction.hset( 'aggregate:' + aggregateId + ':snapshot', 'data', JSON.stringify(snapshot) );
  transaction.hset( 'aggregate:' + aggregateId + ':snapshot', 'eventId', lastEventId );
  transaction.exec( function(err, replies) {
  });
}

Storage.prototype.storeEvent = function(event, callback) {
  var self = this,
  data = JSON.stringify({
    'aggregateId': event.aggregateId, 
    'name': event.name, 
    'attributes': event.attributes
  });

  self.edb.rpush(
    'aggregate:' + event.aggregateId + ':events', data, function(err, index) {
      if(callback) {
        callback(index);
      }
    }
  );
}

Storage.prototype.loadData = function( aggregateId, callback ) {
  var self = this,
      transaction = this.edb.multi();

  transaction.llen( 'aggregate:' + aggregateId + ':events' );
  transaction.hgetall( 'aggregate:' + aggregateId + ':snapshot' );
  transaction.exec( function(err, replies) {
    var snapshot = replies[1];
    var to = replies[0];
    var from = snapshot.eventId + 1;

    self.edb.lrange( 'aggregate:' + aggregateId + ':events', from, to, function(err, docs) {
      var len = docs.length,
          events = [];

      for(var i = 0; i < len; i++) {
        events.push( JSON.parse(docs[i]) );
      }
      
      if( !snapshot.data ) {
        snapshot.data = null;
      }
      console.log(events)
      callback(JSON.parse(snapshot.data), events, to - 1);
    })
  });
}

var storage = new Storage();

module.exports = storage;