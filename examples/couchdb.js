var CouchDb = require('../lib/couchdb');

var couchdb = new CouchDb();

couchdb.request({
  method: 'GET',
  path: '/_uuids'
}, function(data) {
  console.log(data);
});