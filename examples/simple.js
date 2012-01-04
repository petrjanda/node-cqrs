var util = require('util'),
    Aggregate = require('../lib/aggregate')

var Foo = function(id, callback) {
  Aggregate.call(this, id, callback);
}

util.inherits(Foo, Aggregate);

Foo.prototype.apply = function(event) {
  console.log(event);
}

var foo = new Foo(1, function() {
  console.log('Ready!');
})

foo.emit('foobar', {foo: 'bar'})