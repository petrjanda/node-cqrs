var couchRepository = require('../../lib/repository/couchRepository').getInstance(),
    repository = require('../../lib/repository').getInstance(),
    couchStorage = require('../../lib/storage/couchStorage').getInstance(),
    Account = require('./account'),
    AccountBalancesView = require('./accountBalancesView');

var App = function() {}

App.prototype.init = function() {
  repository.strategy = couchRepository;	
  couchRepository.database = couchStorage.database = 'bank';
}



var app = new App();
app.init();

var args = process.argv.slice(2).reverse();

switch(arg = args.pop()) {
  case '--open':
    var number = args.pop();
    var owner = args.pop();

    Account.create(number, owner);
    break;

  case '--deposit':
    var number = args.pop();
    var amount = parseFloat(args.pop());

    new Account(number, function() {
      this.deposit(amount); 
    });
    break;

  case '--list':
    var accountBalancesView = new AccountBalancesView();
    
    accountBalancesView.load(function() {
      console.log(this.data);
    });
    break;

  default:
    console.log(arg);
    console.log([
      'Bank v1.0 (petrjanda@me.com)',
      '',
      'Usage:',
      'node examples/bank/app.js',
      '',
      '  --open accountNumber ownerName - Open new account',
      '  --deposit accountNumber amount - Deposit money to account',
      '  --list - List account balances',
      ''
    ].join('\n'));
}

