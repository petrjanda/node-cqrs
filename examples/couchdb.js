var CouchDb = require('../lib/couchdb');

var couchdb = new CouchDb();

couchdb.getUuid(function(data) {
  console.log(data);
});