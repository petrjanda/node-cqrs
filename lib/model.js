var storage = require('./storage'),
    eventBus = require('./eventBus');

module.exports = var Model = function() {}

Model.prototype.apply = function(event) {
  
}

Model.prototype.emit = function(event) {
  eventBus.store(event);
}