# CQRS (node.js)

Node-CQRS is implementation of command and query responsibility segregation architecture
in node.js. Its ultimate goal is to keep the solution simple, understandable and
flexible to allow adaptation to your project easy.

As the initial repository, couchdb was chosen for it simple API and architecture which
is very much in sync with event sourcing, one of the key concepts of the solution.

## Install and configure

Node-CQRS is available as npm package.

    npm install cqrs

In order to initialize your application. First you need to configure your repository.
At the moment only CouchDB implementation is available and can be initialized with:

```javascript
var repo = require('cqrs').Repository.getInstance(),
    couchdb = require('cqrs').CouchDb.getInstance();

couchdb.database = 'cqrs';
couchdb.options = {
  host: 'localhost',
  port: 5984
};

repo.strategy = couchdb;
```

The code above first setup couch db information and then inject it as the permanency
strategy into the repository object. In require statements you can see, that both
repo and couchdb instances were initialized using getInstance() to allow objects
act as the singleton. In your aggregate and view code, you should be able to work
with no more interaction with these objects, unless you know what are you doing.

### Your first aggregate

CQRS system core is the domain, which is the one place in the system, where all
the business logic lives. In order to model your domain logic into multiple pieces
the concept of aggregates is introduced. Aggregate object in your system, which 
might wrap over multiple value objects or entities, to ensure their transactional
consistency. In other words, when any command is executed, you work with the
aggregate as one object, thus there is no place to corrupt consistency inside
aggregate objects.

Lets create simple aggregate for bank account, which allows us to deposit,
withdraw money and check the current balance.

```javascript
var BankAccount = function(id, callback) {
  Aggregate.apply(this, id, callback);

  // Setup initial bank acount state.
  this.balance = 0;
}

util.inherits(BankAccount, Aggregate);

// BUSINESS LOGIC

BankAccount.prototype.deposit = function(amount) {
  this.emit('moneyDeposited', {amount: amount});
}

BankAccount.prototype.withdraw = function(amount) {
  if(amount < this.balance) {
    throw new Error('Not enough money on your account!');  
  }

  this.emit('moneyWithdrawn', {amount: amount});
}

// EVENT HANDLERS 

BankAccount.prototype.onMoneyDeposited = function(event) {
  this.balance += event.attrs.amount;
}

BankAccount.prototype.onMoneyWithdrawn = function(event) {
  this.balance -= event.attrs.amount;
}
```

The aggregate based and event driven architecture in your domain allows you to
build your domain objects with one huge benefit - Your behavior and state 
mutations are separated. Your commands are together public API of your object.
Command takes a necessary arguments, check the current object state and throw
error in case the command couldn't have been executed or emit event, if it was
successful. Secondly, object implements event handlers, which are responsible
to mutate objects state, based on the event data. Event handlers should not
contain any conditional logic and should never been called directly.


## CI Status

![Build Status](https://secure.travis-ci.org/petrjanda/node-cqrs.png?branch=master)