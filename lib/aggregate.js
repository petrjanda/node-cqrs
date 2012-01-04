var db = require('./couchDb').getInstance();

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
 * In order to properly rebuild the object you will have to override apply()
 * method, which is called once for each stored event related to the aggregate.
 * Its fully up to you to decide how is apply method gonna work as the part of
 * business logic encapsulated in your aggregate object.
 *
 * Example of apply implementation:
 *
 * var BankAccount = function() {...}
 * 
 * BankAccount.prototype.apply = function(event) {
 *   switch(event.name) {
 *     case 'deposit':
 *       this.balance += event.amount;
 *       break;
 *   }  
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

  db.getEventsByAggregate( id, function(events) {
 
    // Apply all loaded events to update aggregate to most recent known state.   
    for(var i = 0; i < events.length; i++) {
      self.apply(events[i]);
    }

    if(callback) {
      callback.call(self);
    }
  });
}



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
  throw new Error('You should overwrite the apply method for your aggregate!');
}

/*
 * In case the aggregate need to store any information about state mutation, it
 * emits an event, which should contain necessary event information. See class
 * annotation to see usage example.
 *
 * @param {Object} Event to be emited to event bus.
 * @return {Void}
 */
Aggregate.prototype.emit = function(name, attributes) {
  db.storeEvent(this._id, name, attributes);
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