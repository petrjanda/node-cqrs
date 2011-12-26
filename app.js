var EventBus = require('./lib/eventBus');
var db = require('./lib/storage');

eventBus = new EventBus();
// eventBus.save( 'FirstEventCreated', 1, {foo: 'bar'} );
// eventBus.save( 'SecondEventCreated', 1 );
// eventBus.save( 'ThirdEventCreated', 1 );
// eventBus.save( 'ForthEventCreated', 1 );
// eventBus.storeSnapshot( 1, 2, {foo: 'bar'} );

eventBus.loadData( 1, function(snapshot, events) {
  console.log('snapshot:');
  console.log(snapshot);

  console.log('events:');
  console.log(events);
});

//db.edb.quit();