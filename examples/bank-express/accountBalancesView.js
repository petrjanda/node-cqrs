var util = require('util'),
    View = require('../../lib/view');


module.exports = AccountBalancesView = function() {
  View.call(this, ['accountCreated', 'moneyDeposited']);
  
  this.data = {};
}

util.inherits(AccountBalancesView, View);



// EVENT HANDLERS

AccountBalancesView.prototype.onMoneyDeposited = function(event) {
  this.data[event.attrs.number].balance += event.attrs.amount;
}

AccountBalancesView.prototype.onAccountCreated = function(event) {
  this.data[event.attrs.number] = {owner: event.attrs.owner, balance: 0};
}