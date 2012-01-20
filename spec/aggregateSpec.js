var util = require('util'),
    couchdb = require('../lib/repository/couchRepository').getInstance(),
    repository = require('../lib/repository').getInstance(),
    Aggregate = require('../lib/aggregate');

describe('Aggregate', function() {

  var Foo, foo, dbGetEventsByAggregateSpy;

  beforeEach(function() {
    repository.strategy = couchdb;

    Foo = function(id, callback) {
      Aggregate.call(this, id, callback);
    }

    util.inherits(Foo, Aggregate);

    dbGetEventsByAggregateSpy = spyOn(repository, 'getEventsByAggregate').andCallFake(function(id, callback) {
      callback([]);
    });      

    foo = new Foo(1);
  })

  it('should be extendable', function() {
    expect(typeof Aggregate.extend).toEqual('function');
  })

  describe('.constructor', function() {

    it( 'should load data from event bus', function() {
      foo = new Foo(1);

      expect(repository.getEventsByAggregate).toHaveBeenCalledWith( 1, jasmine.any(Function) );
    })

    it( 'should call apply, for all events', function() {
      var event;

      runs(function() {
        event = {name: 'myEvent'};

        dbGetEventsByAggregateSpy.andCallFake(function(id, callback) {
          setTimeout(function() {
            callback([event]);
          }, 10);
        });      

        foo = new Foo(1);
        spyOn(foo, 'apply');
      })

      waits(15)

      runs(function() {
        expect( foo.apply ).toHaveBeenCalledWith( event );    
      })
    })

    it( 'should call callback if specified', function() {
      this.handler = function() {}

      spyOn( this, 'handler')
      foo = new Foo(1, this.handler);

      expect( this.handler ).toHaveBeenCalled();  
    })
  })
  
  describe('.apply', function() {

    it('should call raise error if handler is missing', function() {
      var event = {name: 'myEvent'};

      expect(function(){ foo.apply(event) }).toThrow('There is no handler for \'MyEvent\' event!');
    })

    it('shoud call appropriate handler', function() {
      var event = {name: 'myEvent'};
      Foo.prototype.onMyEvent = function() {}
      spyOn(foo, 'onMyEvent');

      foo.apply(event);

      expect(foo.onMyEvent).toHaveBeenCalledWith(event);
    })
  })

  describe('.emit', function() {
    
    it( 'should store event', function() {
      spyOn( repository, 'storeEvent' );
      
      foo.emit( 'foo', {foo: 'bar'} );

      expect( repository.storeEvent ).toHaveBeenCalledWith( 1, 'foo', {foo: 'bar'} );
    })
  })
})