var express     = require('express'),
    CommandBus  = require('../../lib/commandBus'),
    UsersList   = require('./usersList'),
    User        = require('./user');


//
// COMMAND BUS
//

var commandBus = new CommandBus();

commandBus.registerHandler( 'registerUser', function( attrs ) {
  var user = User.create( attrs );
});

commandBus.registerHandler( 'login', function( email, password ) {
   
});


//
// VIEWS
//

var usersList = new UsersList();


//
// WEBSERVER
//

var app = express.createServer();
app.use( express.bodyParser() );
app.listen( 3000 );

app.post( '/user', function(req, res) {
  commandBus.execute( 'registerUser', req.body );
  res.send(202);
});

app.post( '/login', function(req, res) {
  commandBus.execute( 'loginUser', req.body );
  res.send(202);
});