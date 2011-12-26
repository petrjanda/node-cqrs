module.exports = CommandBus = function() {
  this.handlers = {};
}

CommandBus.prototype.registerHandler = function(commandName, handler) {
  this.handlers[commandName] = handler;
}

CommandBus.prototype.execute = function(commandName, attributes) {
  handler = this.handlers[commandName];

  if( !handler ) {
    throw new Error( 'Handler for \'' + commandName + '\' doesn\'t exist!' );
  }

  handler.execute(attributes);
  
}