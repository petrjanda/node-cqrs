var http = require('http'),
    utils = require('../utils'),
    CouchDb = require('../util/couchdb'),
    instance;

module.exports = CouchRepository = function() {
  this.database = 'cqrs';
  this.options = {
    host: 'localhost',
    port: 5984
  };
  
  CouchDb.call(this, this.database, this.options);
}

utils.inherits(CouchRepository, CouchDb);
utils.singleton(CouchRepository);

//
// EVENT SOURCING METHODS
//

/*
 * Store new event.
 *
 * @param {Number} Unique system aggregate identifier.
 * @param {String} Event name.
 * @param {Object} Object with any additional event data.
 * @param {Function} Callback to be triggered. Has to accept array of events.
 *                   NOT-USED YET!
 * @return null
 */
CouchRepository.prototype.storeEvent = function(aggregateId, name, attrs, callback) {
  this.createDocument(JSON.stringify({
    aggregateId: aggregateId,
    name: name,
    type: 'event',
    time: new Date().getTime(),
    attrs: attrs
  }));
}

/*
 * Get list of all events for one specific aggregate.
 *
 * @param {Number} Requested unique system aggregate identifier.
 * @param {Function} Callback to be triggered. Has to accept array of events.
 * @return null
 */
CouchRepository.prototype.getEventsByAggregate = function(aggregateId, callback) {
  var self = this,
  startKey = '[' + aggregateId + ',0]',
  endKey = '[' + aggregateId + ',9999999999999]',
  params = '?startkey=' + startKey + '&endkey=' + endKey;

  this.start = new Date().getTime();

  this.request({
    method: 'GET',
    path: '/' + this.database + '/_design/cqrs/_view/aggregate' + params
  }, function(data) {
    self.parseEvents(data, callback)
  });
}

/*
 * Get list of all events of a specific type.
 *
 * @param {String|Array} Requested event name or array of names.
 * @param {Function} Callback to be triggered. Has to accept array of events.
 * @return null
 */
CouchRepository.prototype.getEventsByName = function(type, from, callback) {
  var self = this;

  // Load function itself called once or multiple times.
  var load = function(type, callback) {
    var startKey = '["' + type + '",' + from + ']',
    endKey = '["' + type + '",9999999999999]',
    params = '?startkey=' + startKey + '&endkey=' + endKey;

    self.start = new Date().getTime();

    self.request({
      method: 'GET',
      path: '/' + self.database + '/_design/cqrs/_view/name' + params
    }, function(data) {
      self.parseEvents(data, callback)
    });    
  }

  if(typeof type == 'string') {
    load(type, callback);
  } else {
    var toFinish = type.length;
    var events = [];

    for(var i in type) {
      load(type[i], function(data) {
        events = events.concat(data);
        toFinish--;

        if(toFinish == 0) {
          callback(events);
        }
      });
    }    
  }
}

CouchRepository.prototype.parseEvents = function(data, callback) {
  var events = [];
  data = JSON.parse(data);

  if(data.error) {
    console.log('ERROR: ' + data.error);
    callback(events);
    return;
  }

  for(var i = 0; i < data.rows.length; i++) {
    delete data.rows[i].value['_id'];
    delete data.rows[i].value['_rev'];

    events.push(data.rows[i].value);
  }
  
  callback(events);
}

// EXPERIMENTAL
CouchRepository.prototype.setup = function() {

  var mapByAggregate = function(doc) {
    if(doc.type == 'event') {
      emit([doc.aggregateId, doc.time], doc)
    }
  }

  var mapByName = function(doc) {
    if(doc.type == 'event') {
      emit([doc.name, doc.time], doc)
    }
  }

  var mapViewSnapshot = function(doc) {
    if(doc.viewId) {
      emit([doc.viewId, doc.time], doc);
    }
  }

  this.request({
    method: 'PUT',
    path: '/' + this.database + '/_design/cqrs',
    data: JSON.stringify({
      language: "javascript",
      views: {
        name: { map: mapByName.toString() },
        aggregate: { map: mapByAggregate.toString() },
        viewSnapshot: {map: mapViewSnapshot.toString() }
      }
    })
  });
}