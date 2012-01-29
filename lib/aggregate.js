var repository = require('./repository').getInstance(),
    utils = require('./utils');

/*
 * Aggregate is the cluster of system entities and value objects used to 
 * maintain transactional consistency. It's recommended to keep reasonably small
 * and keep business driven set of invariants. 
 *
 * RECOMMENDED ARCHITECTURE
 *
 * COMMANDS
 * Command executes the behavior of the aggregate. It takes arguments, which
 * are necessary to let the command be executed, interact with current aggregate
 * state and at the end should result in either throwing an exception if something
 * goes wrong or with emit() call, in order to store information about executate
 * state mutation. Event should contain all necessary details to provide full
 * details about executed behavior. Be sure to never update aggregate state
 * directly! Thats responsibility of apply method described bellow.
 *
 * Example of command:
 *
 * var BankAccount = function() {...}
 * 
 * BankAccount.withdraw = function(amount) {
 *   if(this.balance < amount) {
 *     throw new Error('Transaction declined.');
 *   }  
 *
 *   this.emit('moneyWithdrawn', {amount: amount});
 * }
 *
 *
 *
 * STATE
 * Your aggregate will have state, represented by your entities and value
 * objects. The current state of aggregate is created by setting its initial
 * state and applying all the necessary events, which are loaded from event
 * storage. 
 *
 * In order to properly rebuild the object you will have to prepare one event
 * handler for each event, which does aggregate have. Each event handler is
 * the separete function, which name is composed from 'on' and event name.
 *
 * Example of apply implementation:
 *
 * var BankAccount = function() {...}
 * 
 * BankAccount.prototype.onMoneyWithdrawn = function(event) {
 *   this.balance -= event.amount;
 * }
 * 
 *
 *
 * QUERIES
 * Because of asynchronous load of data from event storage, you have to wait
 * until your constructor callback is triggered, before you will be able to
 * read state from your aggregate.
 *
 * Example of query implementation:
 *
 * var latestBalance = 0;
 *
 * var a = new BankAccount(1234, function() {
 *   latestBalance = this.balance; // fill data to latestBalance from aggregate
 * })
 *
 * @param {Number} Unique system aggregate identifier.
 */
module.exports = Aggregate = function( id, callback ) {
  var self = this;
  this._id = id;

  repository.getEventsByAggregate( id, function(events) {
 
    // Apply all loaded events to update aggregate to most recent known state.   
    for(var i = 0; i < events.length; i++) {
      self.apply(events[i]);
    }

    if(callback) {
      callback.call(self);
    }
  });
}

utils.extendable(Aggregate);

//
// EVENT SOURCING
//

/*
 * Apply given event to the aggregate in order to update its status. See class
 * annotation to see usage example.
 *
 * @param {Object} Event object.
 * @return {Void}
 */
Aggregate.prototype.apply = function(event) {
  var name = event.name.charAt(0).toUpperCase() + event.name.slice(1),
      handler = this['on' + name]

  if(typeof handler != 'function') {
    throw new Error('There is no handler for \'' + name + '\' event!');
  }

  handler.call(this, event);
}

/*
 * Store any information about state mutation. See class
 * annotation for usage example.
 *
 * @param {Object} Event to be emited to event bus.
 * @return {Void}
 */
Aggregate.prototype.emit = function(name, attributes) {
  var self = this;

  repository.storeEvent(this._id, name, attributes, function(event) {
    self.apply(event);
  });
}



//
// SNAPSHOOTING
//

/*
 * Initialize aggregate state using the data specified in a snapshot.
 *
 * @param {Object} Snapshot data.
 * @return {Void}
 *
 * Aggregate.prototype.init = function(data) { }
 */

/*
 * Return snapshot of aggregate current state. 
 *
 * @return {Object} Object containing all necessary attributes to reinitialize
 *                  aggregate current state.
 *
 * Aggregate.prototype.snapshot = function() { return {}; }
 */