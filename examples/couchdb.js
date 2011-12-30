var CouchDb = require('../lib/couchdb');

var couchdb = new CouchDb();

couchdb.request({
  method: 'PUT',
  path: '/cqrs/asdfsdfasdfasf',
  data: '{"foo":"bar"}'
});