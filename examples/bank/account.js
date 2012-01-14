var util = require('util'),
	Aggregate = require('../../lib/aggregate');

module.exports = Account = function(id, callback) {
  Aggregate.call(this, id, callback);

  this.number = '';
  this.owner = '';
  this.balance = 0;
}

util.inherits(Account, Aggregate);



// BUSINESS LOGIC

Account.create = function(number, owner) {
  var account = new Account(number);
  account.emit('accountCreated', {number: number, owner: owner});
}

Account.prototype.deposit = function(amount) {
  this.emit('moneyDeposited', {number: this.number, amount: amount});
}



// EVENT HANDLERS

Account.prototype.onAccountCreated = function(event) {
  this.owner = event.attrs.owner;
  this.number = event.attrs.number;
}

Account.prototype.onMoneyDeposited = function(event) {
  this.balance += event.attrs.amount;
}