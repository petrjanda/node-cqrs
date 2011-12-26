var eventBus = require('./eventBus');

module.exports = Aggregate = function( id ) {
  var self = this;
  var start = new Date().getTime();

  this._quantity = 0;
  this._id = id;

  eventBus.loadData( this._id, function(snapshot, events, lastEventId) {
    self.init(snapshot);
    
    var len = events.length;

    for(var i = 0; i < len; i++) {
      self.apply(events[i]);
    }

    eventBus.storeSnapshot(self._id, lastEventId, {quantity: self._quantity});
    console.log(new Date().getTime() - start + " ms");
  });
}

Aggregate.prototype.init = function(data) {
  if(!data) {
    return;
  }
  
  this._quantity = data.quantity;
}

Aggregate.prototype.apply = function(event) {
  this._quantity += event.attributes.amount;
}

Aggregate.prototype.emit = function(event) {
  eventBus.store(event);
}

Aggregate.find = function( id ) {
  return new Aggregate( id );
}