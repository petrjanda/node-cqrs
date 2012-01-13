var couchRepository = require('../../lib/repository/couchRepository').getInstance(),
    repository = require('../../lib/repository').getInstance(),
    util = require('util'),
    Aggregate = require('../../lib/aggregate'),
    View = require('../../lib/view')

var App = function() {}

App.prototype.init = function() {
  repository.strategy = couchRepository;	
  couchRepository.database = 'bank';
}

var Account = function(id, callback) {
  Aggregate.call(this, id, callback);

  this.balance = 0;
}

util.inherits(Account, Aggregate);

Account.create = function(number) {
  var account = new Account(number);
  account.emit('accountCreated', {number: number});
}

Account.prototype.deposit = function(amount) {
  this.emit('moneyDeposited', {amount: amount});
}

Account.prototype.onMoneyDeposited = function(event) {
  this.balance += event.attrs.amount;
}

var app = new App();
app.init();

var account = new Account(1);
account.deposit(10);

var AccountBalancesView = function() {
  View.call(this, ['accountCreated', 'moneyDeposited']);
}

util.inherits(AccountBalancesView, View);

var accountBalancesView = new AccountBalancesView();
accountBalancesView.load();