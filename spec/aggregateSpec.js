var util = require('util'),
    db = require('../lib/couchDb').getInstance(),
    Aggregate = require('../lib/aggregate');

describe('Aggregate', function() {
  
  describe('.apply', function() {

    var Foo;

    beforeEach(function() {
      Foo = function(id, callback) {
        Aggregate.call(this, id, callback);
      }

      util.inherits(Foo, Aggregate);

      spyOn(db, 'getEventsByAggregate').andCallFake(function(id, callback) {
        callback([]);
      });      
    })

    it('should call raise error if handler is missing', function() {
      var foo = new Foo(1),
          event = {name: 'myEvent'};

      expect(function(){ foo.apply(event) }).toThrow('There is no handler for \'MyEvent\' event!');
    })

    it('shoud call appropriate handler', function() {
      Foo.prototype.onMyEvent = function() {}

      var foo = new Foo(1),
          event = {name: 'myEvent'};
      
      spyOn(foo, 'onMyEvent');

      foo.apply(event);

      expect(foo.onMyEvent).toHaveBeenCalledWith(event);
    })
  })

})

// var Aggregate = require('../lib/aggregate'),
//     EventBus = require('../lib/eventBus'),
//     jasmine = require('jasmine-node');

// describe('Aggregate', function(){
  
//   beforeEach(function() {
//     EventBus.storeSnapshot = function() {};
//   })


//   describe('.emit', function() {
    
//     it( 'should emit event to event bus', function() {
//       var aggregate = new Aggregate(1);
//       spyOn( EventBus, 'storeEvent' );
      
//       aggregate.emit( 'foo', {foo: 'bar'} );

//       expect( EventBus.storeEvent ).toHaveBeenCalledWith( 'foo', 1, {foo: 'bar'} );
//     })

//   })


//   describe('.constructor', function() {


//     it( 'should load data from event bus', function() {
//       spyOn(EventBus, 'loadData');

//       var aggregate = new Aggregate(1)

//       expect( EventBus.loadData ).toHaveBeenCalledWith( 1, jasmine.any(Function) );
//     })


//     describe( 'load data callback', function() {
//       var aggregate = null,
//           foo = { foo: 'bar' };

//       it( 'should not call init, if no snapshot is ready', function() {
//         runs(function() {
//           EventBus.loadData = function( id, callback ) {
//             setTimeout(function() {
//               callback( null, [], null );
//             }, 10);
//           }

//           this.aggregate = new Aggregate( 1 );
//           spyOn( this.aggregate, 'init' );
//         })

//         waits(15);

//         runs(function() {
//           expect( this.aggregate.init ).not.toHaveBeenCalled();        
//         })
//       })


//       it( 'should call init, if snapshot is ready', function() {
//         runs(function() {
//           EventBus.loadData = function( id, callback ) {
//             setTimeout(function() {
//               callback( foo, [], null );
//             }, 10);
//           }
          
//           this.aggregate = new Aggregate( 1 );
//           spyOn( this.aggregate, 'init' );
//         })

//         waits(15);

//         runs(function() {
//           expect( this.aggregate.init ).toHaveBeenCalledWith( foo );  
//         })
//       })


//       it( 'should call apply, for all events', function() {
//         runs(function() {
//           EventBus.loadData = function( id, callback ) {
//             setTimeout(function() {
//               callback( null, [ foo ], null );
//             }, 10);
//           }

//           this.aggregate = new Aggregate( 1 );
//           spyOn( this.aggregate, 'apply' );
//         })

//         waits(15);

//         runs(function() {
//           expect( this.aggregate.apply ).toHaveBeenCalledWith( foo );  
//         })
//       })


//       it( 'should call store snapshot', function() {
//         runs(function() {
//           EventBus.loadData = function( id, callback ) {
//             setTimeout(function() {
//               callback( null, [ foo ], 1 );
//             }, 10);
//           }

//           this.aggregate = new Aggregate( 1 );
//           spyOn( EventBus, 'storeSnapshot' );
//           spyOn( this.aggregate, 'snapshot' ).andReturn( foo );
//         })

//         waits(15);

//         runs(function() {
//           expect( EventBus.storeSnapshot ).toHaveBeenCalledWith( 1, 1, foo );  
//         })
//       })


//       it( 'should call callback if specified', function() {
//         this.handler = function() {}

//         EventBus.loadData = function( id, callback ) {
//           callback( null, [ foo ], 1 );
//         }

//         spyOn( this, 'handler')
//         this.aggregate = new Aggregate( 1, this.handler );

//         expect( this.handler ).toHaveBeenCalled();  
//       })
      
//     })

//   })

// }) 