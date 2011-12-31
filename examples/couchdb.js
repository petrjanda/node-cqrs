var CouchDb = require('../lib/couchdb');

var couchdb = new CouchDb();

couchdb.storeEvent(1, 'account:opened', {number: '35-439598'});