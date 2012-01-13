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

CouchStorage.prototype.storeView = function(view) {
  this.createDocument(JSON.stringify({
    viewId: view.uid,
    type: 'view',
    lastEvent: view.lastEvent,
    data: view.data
  }));
}

CouchStorage.prototype.loadView = function(id, callback) {
  this.request({
    method: 'GET',
    path: '/' + this.database + '/' + id
  }, function(data) {
    data = JSON.parse(data);
    delete data._id;
    delete data._rev;
    delete data.type;
    
    callback(data);
  });
}