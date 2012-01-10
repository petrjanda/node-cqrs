var util = require('util'),
    CouchDb = require('../util/couchdb');

module.exports = CouchStorage = function() {}

util.inherits(CouchStorage, CouchDb);

CouchStorage.storeView = function(view) {}

CouchStorage.loadView = function(id, callback) {}