var Aggregate = require('./lib/aggregate'),
    CommandBus = require('./lib/commandBus'),
    View = require('./lib/view'),
    Repository = requre('./lib/couchdb');

module.exports.Aggregate = Aggregate;
module.exports.CommandBus = CommandBus;
module.exports.View = View;
module.exports.Repository = Repository;