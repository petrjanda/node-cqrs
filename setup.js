var couchDb = require('./lib/couchdb').getInstance();

couchDb.database = 'cqrs';
couchDb.setup();