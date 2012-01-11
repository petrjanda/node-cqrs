//
// EXPERIMENTAL VERSION
//

var util = require('util'),
    utils = require('../utils'),
    CouchDb = require('../util/couchdb');

module.exports = CouchStorage = function() {
  CouchDb.call(this, 'cqrs');
}

util.inherits(CouchStorage, CouchDb);
utils.singleton(CouchStorage);

CouchStorage.storeView = function(view) {
  this.createDocument(JSON.stringify({
    viewId: view.uid,
    type: 'event',
    lastEvent: view.lastEvent,
    data: view.data
  }));
}

CouchStorage.loadView = function(id, callback) {
  this.request({
    method: 'GET',
    path: '/'
  }, function(data) {
    callback(JSON.parse(data).uuids[0]);
  });
}