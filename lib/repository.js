var utils = require('./utils');

module.exports = Repository = function(strategy) {
  this.strategy = strategy;
  this.handlers = {};
}

utils.singleton(Repository);
utils.delegators(Repository, 'strategy', 'storeEvent');
utils.delegators(Repository, 'strategy', 'getEventsByAggregate');

Repository.prototype.on = function(name, callback) {
  this.handlers[name] = this.handlers[name] || [];

  if(this.handlers[name].indexOf(callback) == -1) {
    this.handlers[name].push(callback);
  }
}

//
// SNAPSHOOTING SUPPORT
//

/*
 * Store the given snapshot to the repository.
 *
 * @param {Snapshot} Snapshot object to be stored.
 */
Repository.prototype.storeSnapshot = function(snapshot) {}

/*
 * Get the snapshot data for a given aggregate. In case there is multiple 
 * snapshots stored, most recent one is chosen. As soon as the result is
 * found callback is triggered with the only one param - the snapshot object
 * itself.
 *
 * If no snapshot is found, callback is called with null.
 *
 * @param {String} Unique aggregate identifier.
 * @param {Function} Callback to be triggered after the operation is done.
 */
Repository.prototype.getSnapshotByAggregateId = function(aggregateId, callback) {}
