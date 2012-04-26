var couchRepository = require('../../lib/repository/couchRepository').getInstance(),
    repository = require('../../lib/repository').getInstance(),
    couchStorage = require('../../lib/storage/couchStorage').getInstance(),
    Account = require('./account'),
    AccountBalancesView = require('./accountBalancesView'),
    express = require ('express');


var app = express.createServer();


repository.strategy = couchRepository;
couchRepository.database = couchStorage.database = 'bank';

app.init();


app.get('/', function(req, res){
  res.send('Hello, I am CQRS Bank system example \n');
});

app.post('/open/:number/:name', function(req, res) {
  var number = req.params.number;
  var owner  = req.params.name;
  Account.create(number, owner);
  res.send('Done');
});

app.post('/deposit/:number/:amount', function(req, res) {
  var number = req.params.number;
  var amount = req.params.amount;
  new Account(number, function() {
    this.deposit(amount); 
  });
  res.send('Done');
});

app.get('/list', function(req, res) {
  var accountBalancesView = new AccountBalancesView();

  accountBalancesView.load(function() {
    res.send(this.data);
  });
})

app.listen(3000);