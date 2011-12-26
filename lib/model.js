storage = require('./storage');

module.exports = var Model = function() {}

Model.prototype.apply = function(event) {
  
}

Model.prototype.emit = function(event) {
  storage.storeEvent(event);
}