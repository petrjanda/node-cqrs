var db = require('./couchDb').getInstance();

/*
 * Aggregate is the cluster of system entities and value objects use to maintain
 * transactional consistency. It encapsulate set of specific set of objects
 * which should keep consistent and keep business driven set of invariants.
 *
 * RECOMMENDED ARCHITECTURE
 *
 * COMMANDS
 * Each command defined by aggregate should be evaluateable using only the
 * aggregate current state. In the command method, any interaction with current
 * aggregate might be done in order to decide if the requested command can be
 * executed. If the command execution mutate aggregate's state, it shouldn't
 * change it directly! Instead make sure your command methods always result
 * with emit() call, to store the information about state mutation or to throw
 * an exception with reasonable content, to signify that command couldn't be
 * executed.
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
 * In order to properly rebuild the object you will have to override apply()
 * method. Its fully up to you to decide how is apply method gonna use the
 * event data as the part of business logic, which lives inside of your
 * aggregate.
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

    if(callback)
      callback.call(self);
  });
}



//
// EVENT SOURCING
//

/*
 * Apply given event to the aggregate in order to update its status.
 *
 * @param {Object} Event object.
 * @return {Void}
 */
Aggregate.prototype.apply = function(event) {}

/*
 * In case the aggregate need to store any information about action taken, it
 * emits an event, which contains necessary event information.
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