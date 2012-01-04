var express     = require('express'),
    CommandBus  = require('../../lib/commandBus'),
    Account     = require('./account');

//
// APPLICATION SERVICES
//

var commandBus = new CommandBus();

commandBus.registerHandler('openAccount', function(attrs) {
  var account = Account.create(attrs.id);
})

commandBus.registerHandler('depositMoney', function(attrs) {
  new Account(attrs.id, function() {
    this.deposit(attrs.amount);
  });
})

commandBus.registerHandler('withdrawMoney', function(attrs) {
  new Account(attrs.id, function() {
    try {
      this.withdraw(attrs.amount);
    } catch(e) {
      attrs.callback(true);
    }

    attrs.callback(false);
  });
})

//
// HTTP DELIVERY MECHANISM
//

var server = express.createServer();
server.use(express.bodyParser());

server.get('/', function(req, res) {
  res.send('System OK');
})

server.get('/:id/balance', function(req, res) {
  var a = new Account(req.params.id, function() {
    res.send( this._balance.toString() + '\n' );
  });
});

server.post('/open', function(req, res) {
  commandBus.execute('openAccount', { id: req.body.number });
  res.send('Accepted', 202);
});

server.post('/:id/deposit', function(req, res) {
  commandBus.execute('depositMoney', { id: req.params.id, amount: req.body.amount });
  res.send('Accepted', 202);
});

server.post('/:id/withdraw', function(req, res) {
  commandBus.execute('withdrawMoney', { id: req.params.id, amount: req.body.amount, callback: function(err) {
    err ? res.send('Declined', 401) : res.send('Accepted', 202)
  }});
});

server.listen(4000);
