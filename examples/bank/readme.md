# Bank

Bank is the very simple application, which allows you to manage multiple accounts
and their balance. There is just a few operations, which are allowed by the system:

* Open new account with specified number and owner name
* Deposit specific amount of money to the given account
* Get view, with list of accounts with their balance

## Architecture

The system is based on CQRS library, therefore separates the writes (commands)
and reads (queries). The business domain for a given application is very simple
and is focused to model the behavior described in the list above.

## Implementation

Implementation is built on top of cqrs npm package and use CouchDB for both events
storage and view cache as well.

### Aggregate

The only system aggregate is Account. Its designed as object, which represent
real bank account and is identified by its number and owner id. In order to
know, how much money there is on the account, the balance information is also
part of the account state.

The whole class implementation has 3 major parts: constructor, business commands 
and event handlers. Constructor just implement inharitance from aggregate so
lets take a look at commands.

_Commands_ are supposed to do some action on your aggregate. They should always be 
modeling the real world behavior. There is no CRUD! Who has ever seen delete 
action on the account? What is that supposed to do? Instead bank object would 
have .deposit(), .withdraw(), .transfer() are valid account operations.

```javascript
Account.prototype.deposit = function(amount) {
  this.emit('moneyDeposited', {number: this.number, amount: amount});
}
```

The implementation of command itself has these phases:

* 1. Check the current aggregate state to see if the command can be finished
* 2a. Throw an error if the command cant be executed.
* 2b. Emit an event in case command was executed well. Event should contain all
the necessary details.

The command should never have the return value and even more important should
never mutate state. Do the check, throw en error or emit an event. Thats command.

_Event handlers_ on the other hand are the place when aggregate state is updated.
They should apply event data back to the aggregate. Because they reflect the 
events which already happened, there should be no conditional logic. The implementation
in Account looks like:

```javascript
Account.prototype.onAccountCreated = function(event) {
  this.owner = event.attrs.owner;
  this.number = event.attrs.number;
}

Account.prototype.onMoneyDeposited = function(event) {
  this.balance += event.attrs.amount;
}
```

### Views

The cqrs package does handle the core system architecture and Aggregate implements
the business logic and behavior of your system entities. We can call that as command
side. 

To satisfy your users, you will have to give them back reports. Thats the query
side of the system, which consist of views. Each view consumes specific list of
events from the event storage and use them to update itself. It basically builds
up the output report for a user. 

Lets take a look at our only one view: Account balances. Its target is to display
list of account information with current balances. You can see the view is the
place, where data from multiple aggregates are joined together.

The core part of the view implementation are event handlers:

```javascript
AccountBalancesView.prototype.onMoneyDeposited = function(event) {
  this.data[event.attrs.number].balance += event.attrs.amount;
}

AccountBalancesView.prototype.onAccountCreated = function(event) {
  this.data[event.attrs.number] = {owner: event.attrs.owner, balance: 0};
}
```

Each event handler does some specific update of the view data. When all requested
events from event storage are applied, the result report is built. The output of this
view looks like this:

```json
{ 
  '865389270297': { owner: 'Petr Janda', balance: 656 },
  '354395980207': { owner: 'Petr', balance: 2200 } 
}
```