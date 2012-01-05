var couchDb = require('./lib/couchdb').getInstance();

CouchDb.database = 'cqrs';
couchDb.setup();