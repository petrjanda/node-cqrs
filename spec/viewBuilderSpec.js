var util = require('util'),
    couchdb = require('../lib/repository/couchRepository').createRepository(),
    repository = require('../lib/repository').getInstance(),
    storage = require('../lib/storage/couchStorage').createStorage(),
    ViewBuilder = require('../lib/viewBuilder');

describe('ViewBuilder', function() {
  var view, MyViewBuilder;

  beforeEach(function() {
    repository.strategy = couchdb;

    MyViewBuilder = function(callback) {
      ViewBuilder.call(this, 'myview', 'foo', callback);

      this.snapshots = true;
    }

    util.inherits(MyViewBuilder, ViewBuilder);

    spyOn(repository, 'getEventsByName').andCallFake(function(names, from, callback) {
      callback([]);
    });      

    view = new MyViewBuilder();
  })

  describe('constructor', function() {
    it('should initialize view id', function() {
      expect(view.uid).toEqual('myview');
    })
  })

  describe('.build', function() {

    describe('with disabled storage', function() {
      it('should directly call getEventsByName', function() {
        view.snapshots = false;

        view.build();

        expect(repository.getEventsByName).toHaveBeenCalledWith( 'foo', 1, jasmine.any(Function) );;
      })      
    })

    it('should load data from storage', function() {
      spyOn(storage, 'loadView');
      view.uid = '45fsgs45gh';

      view.build();

      expect(storage.loadView).toHaveBeenCalledWith('45fsgs45gh', jasmine.any(Function));
    })

    describe('with explicit storage ofload', function() {
      it('should directly call getEventsByName', function() {
        spyOn(storage, 'loadView');
        view.uid = '45fsgs45gh';

        view.build(true);

        expect(storage.loadView).not.toHaveBeenCalled();
      })
    })

    describe('callback', function() {
      
      beforeEach(function() {
        spyOn(storage, 'loadView').andCallFake(function(uid, callback) {
          callback({
            uid : 'f8s7h5dggs', 
            lastEvent : 1325721336913, 
            data : { foo : 'bar' }
          })
        })
      })

      it('should store data to the view', function() {
        view.build();

        expect(view.data).toEqual({ foo : 'bar' })
      })

      it('should store data to the view', function() {
        view.build();

        expect(view.lastEvent).toEqual(1325721336913);
      })


      it('should load events increment data from repository', function() {
        view.build();

        expect(repository.getEventsByName).toHaveBeenCalledWith( 'foo', 1325721336914, jasmine.any(Function) );
      })


      it( 'should call apply, for all events', function() {
        var event = {foo: 'bar'};

        spyOn(view, 'apply');
        repository.getEventsByName.andCallFake(function(names, from, callback) {
          callback([event]);
        }); 

        view.build();

        expect( view.apply ).toHaveBeenCalledWith( event, jasmine.any(Function) );    
      })

      describe( 'snapshooting', function() {
        var event = {foo: 'bar'};

        beforeEach(function() {
          spyOn(view, 'apply').andCallFake(function(event, callback) { 
            callback() 
          });

          spyOn(storage, 'purgeView');
          spyOn(storage, 'storeView');
        })

        function fakeGetEvents(events) {
          repository.getEventsByName.andCallFake(function(names, from, callback) {
            callback(events);
          }); 
        }

        describe( 'with events increment', function() {
          it( 'should store view if events increment was loaded', function() {
            fakeGetEvents([event]);

            view.build();

            expect( storage.storeView ).toHaveBeenCalledWith(view);  
          })

          it( 'should store view if events increment was loaded', function() {
            fakeGetEvents([event]);

            view.build();

            expect( storage.purgeView ).toHaveBeenCalledWith(view.uid);
          })
        })


        it( 'should not store view if no events were loaded', function() {
          fakeGetEvents([]); 

          view.build();

          expect( storage.storeView ).not.toHaveBeenCalledWith(view);  
        })

        it( 'should not store view if snapshooting is disabled', function() {
          fakeGetEvents([event]);
          view.snapshots = false;

          view.build();

          expect( storage.storeView ).not.toHaveBeenCalled();
        })
      })

      it( 'should call callback if specified', function() {
        this.handler = function() {}
        spyOn( this, 'handler')

        view.build(this.handler);

        expect( this.handler ).toHaveBeenCalled();  
      })
    })
  })

  describe('.load', function() {

    it('should load data from storage', function() {
      spyOn(storage, 'loadView');
      view.uid = '45fsgs45gh';

      view.load();

      expect(storage.loadView).toHaveBeenCalledWith('45fsgs45gh', jasmine.any(Function));
    })

    describe('callback', function() {
      
      beforeEach(function() {
        spyOn(storage, 'loadView').andCallFake(function(uid, callback) {
          callback({
            uid : 'f8s7h5dggs', 
            lastEvent : 1325721336913, 
            data : { foo : 'bar' }
          })
        })
      })

      it('should store data to the view', function() {
        view.load();

        expect(view.data).toEqual({ foo : 'bar' })
      })

      it('should store data to the view', function() {
        view.load();

        expect(view.lastEvent).toEqual(1325721336913);
      })

      describe('callback', function() {
        it( 'should be called if specified', function() {
          this.handler = function() {}
          spyOn( this, 'handler')

          view.load(this.handler);

          expect( this.handler ).toHaveBeenCalledWith();  
        })

        it( 'should be called with proper binding', function() {
          var self = null;
          this.handler = function() { self = this; }

          view.load(this.handler);

          expect(self).toEqual(view);  
        })
      })

    })
  })
  
  describe('.apply', function() {

    it('should call raise error if handler is missing', function() {
      var event = {name: 'myEvent'};

      expect(function(){ view.apply(event) }).toThrow('There is no handler for \'MyEvent\' event!');
    })

    it('shoud call appropriate handler', function() {
      var event = {name: 'myEvent'},
          f = function() {};

      MyViewBuilder.prototype.onMyEvent = function() {}
      spyOn(view, 'onMyEvent');

      view.apply(event, f);

      expect(view.onMyEvent).toHaveBeenCalledWith(event, f);
    })
  })
})