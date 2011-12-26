var db = require('./storage');

module.exports = Event = function( data ) {
  data = data || {};
  this.name = data.name;
  this.aggregateId = data.aggregateId;  
  this.attributes = data.attributes;
  this.snapshot = data.null;
}

Event.prototype.setSnapshot = function( snapshot ) {
  this.snapshot = snapshot;
  this.save();
}

Event.prototype.getSnapshot = function() {
  return this.snapshot;
}

Event.prototype.hasSnapshot = function() {
  return !!this.snapshot;
}

Event.prototype.save = function() {
  db.storeEvent(this);
}

Event.getEventBefore = function( aggregateId, eventId, callback ) {
  db.getEventBefore( aggregateId, eventId, callback );
}

Event.getLastEventIndex = function( aggregateId, callback ) {
  db.getLastEventIndex( aggregateId, function(err, doc) {
    callback(doc);
  });
}