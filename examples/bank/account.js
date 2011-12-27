var util        = require('util'),
    Aggregate   = require('../../lib/aggregate');


module.exports =  Account = function(id, cb) {
  Aggregate.call(this, id, cb);
}

util.inherits(Account, Aggregate);

//
// BUSINESS LOGIC
//

Account.prototype.withdraw = function( amount ) {
  if( amount > this._balance ) {
    this.emit( 'moneyWithdrawnDeclined', {amount: amount} );
    throw new Error( 'Declined' );
  }

  this.emit( 'moneyWithdrawn', {amount: amount} );
}

Account.prototype.deposit = function( amount ) {
  this.emit( 'moneyDeposited', {amount: amount} );
}

Account.prototype.apply = function( event ) {

  switch(event.name) {
    case 'accountCreated':
      this._balance = 0;
      break;

    case 'moneyDeposited':
      this._balance += parseFloat(event.attributes.amount);
      break;

    case 'moneyWithdrawn':
      this._balance -= parseFloat(event.attributes.amount);
      break;
  }
}

//
// ACTIONS
//

Account.prototype.init = function( data ) {
  this._balance = data.balance;
}

Account.prototype.snapshot = function() {
  return { balance: this._balance };
}

Account.create = function( id ) {
  var account = new Account( id );
  account.emit( 'accountCreated' );
  return account;
}