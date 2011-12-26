var CommandBus = require('./lib/commandBus'),
    CommandHandler = require('./lib/commandHandler');

commandBus = new CommandBus();
commandBus.registerHandler( 'foo', new CommandHandler() );

commandBus.execute( 'foo' );