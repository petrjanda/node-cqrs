var Aggregate = require('./lib/aggregate'),
    CommandBus = require('./lib/commandBus'),
    View = require('./lib/view'),
    ViewBuilder = require('./lib/viewBuilder'),
    Repository = require('./lib/repository'),
    CouchRepository = require('./lib/repository/couchRepository'),
    CouchStorage = require('./lib/storage/couchStorage'),
    Denormalizer = require('./lib/denormalizer');

module.exports.Aggregate = Aggregate;
module.exports.CommandBus = CommandBus;
module.exports.View = View;
module.exports.ViewBuilder = ViewBuilder;
module.exports.Repository = Repository;
module.exports.Denormalizer = Denormalizer;

module.exports.CouchRepository = CouchRepository;
module.exports.CouchStorage = CouchStorage;