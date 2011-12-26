/*
 * Command handlers are registered for a given command  on command bus.
 */
module.exports = CommandHandler = function() {}

/*
 * Function to be called as the execution for a given
 * command handler.
 */
CommandHandler.prototype.execute = function() {
  throw new Error('Need to be implemented!')
}