var util = require('util'),
	View = require('../../lib/view');


module.exports = AccountBalancesView = function() {
  View.call(this, ['accountCreated', 'moneyDeposited']);
  
  this.data = {total: 0};
}

util.inherits(AccountBalancesView, View);

AccountBalancesView.prototype.onMoneyDeposited = function(event) {
  this.data.total += event.attrs.amount;
}