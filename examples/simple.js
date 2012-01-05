var util = require('util'),
    View = require('../lib/view'),
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
//  console.log('Ready!');
//  console.log(this.sentence);
})

// for(var i = 0; i < 1000; i++) {
//  foo.emit('foobar', {foo: 'bar'});
// }


var FooView = function() {
  View.call(this, 'foobar', this.ready);

  this.count = 0;
}

util.inherits(FooView, View);

FooView.prototype.apply = function(event) {
  this.count++
}

FooView.prototype.ready = function() {
  console.log('Current count:' + this.count); 
}

var view = new FooView();