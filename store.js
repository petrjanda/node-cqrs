var eventBus = require('./lib/eventBus');
var db = require('./lib/storage');

var len = 1000;

for(var i = 0; i < len; i++) {
  eventBus.save( 'Created' + i, 1, {amount: i} );  
}