var EventBus = require('../../lib/eventBus');

module.exports = UsersList = function() {
  EventBus.registerHandler( ['created', 'passwordUpdated'], this.handleEvent);
}

UsersList.prototype.handleEvent = function( event ) {
  console.log( event );
}