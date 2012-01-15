var utils = require('./utils');

/*
 * Command bus is the single entry point to send a commands to the domain. Its
 * responsibility is to retrieve events and search the proper handler, which
 * is gonna execute the command itself.
 */
module.exports = CommandBus = function() {
  this.handlers = {};
}

utils.singleton(CommandBus);

/*
 * Command Bus is able to respond only to given list of actions. As the command
 * appear on the bus, application search for a proper command handler and 
 * delegate the execution to it.
 * 
 * @param {String} Command name, to register handler for.
 * @param {Object} Function to be called when command is received.
 */
CommandBus.prototype.registerHandler = function(commandName, handler) {
  if(typeof handler != 'function') {
    throw new Error('Handler has to be function!');
  }
  
  this.handlers[commandName] = handler;
}

/*
 * Execute a given command with a given attributes. As the command is sent to 
 * the command bus, it expects any handler is registered for it. If there is no 
 * handler specified application is not able to understand a given command, thus
 * it will fail to execute.
 *
 * @param {String} Command name to be executed.
 * @param {Object} Object with any additional attributes, to be passed to
 *                 command handler, which is going to execute the command.
 */
CommandBus.prototype.execute = function(commandName, attributes) {
  handler = this.handlers[commandName];

  if( !handler ) {
    throw new Error( 'Handler for \'' + commandName + '\' doesn\'t exist!' );
  }

  handler(attributes);
}