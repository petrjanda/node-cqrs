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

### Aggregate implementation

The only system aggregate is Account. Its designed as object, which represent
real bank account and is identified by its number and owner id. In order to
know, how much money there is on the account, the balance information is also
part of the account state.

The whole class implementation has 3 major parts: constructor, business commands 
and event handlers. Constructor just implement inharitance from aggregate so
lets take a look at commands.

Commands are supposed to do some action on your aggregate. They should always be 
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
