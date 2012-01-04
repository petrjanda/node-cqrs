var util = require('util'),
    db = require('../lib/couchdb').getInstance(),
    Aggregate = require('../lib/aggregate')

var Foo = function(id, callback) {
  Aggregate.call(this, id, callback);

  this.sentence = '';
}

util.inherits(Foo, Aggregate);

Foo.prototype.apply = function(event) {
  switch(event.name) {
    case 'foobar':
      this.sentence += ' ' + event.attrs.foo;
      break;
  }
}

var foo = new Foo(1, function() {
  console.log('Ready!');
  console.log(this.sentence);
})

foo.emit('foobar', {foo: 'bar'});

db.getEventsByType('foobar', function(events) {
  console.log(events);
})