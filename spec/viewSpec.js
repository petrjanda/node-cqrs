var util = require('util'),
    couchdb = require('../lib/repository/couchRepository').getInstance(),
    repository = require('../lib/repository').getInstance(),
    storage = require('../lib/storage/couchStorage').getInstance(),
    View = require('../lib/view');

describe('View', function() {
  var view, MyView;

  beforeEach(function() {
    repository.strategy = couchdb;

    MyView = function(callback) {
      View.call(this, 'myview', 'foo', callback);

      this.snapshots = true;
    }

    util.inherits(MyView, View);

    spyOn(repository, 'getEventsByName').andCallFake(function(names, from, callback) {
      callback([]);
    });      

    view = new MyView();
  })

  describe('constructor', function() {
    it('should initialize view id', function() {
      expect(view.uid).toEqual('myview');
    })
  })

  describe('.load', function() {

    describe('with disabled storage', function() {
      it('should directly call getEventsByName', function() {
        view.snapshots = false;

        view.load();

        expect(repository.getEventsByName).toHaveBeenCalledWith( 'foo', 1, jasmine.any(Function) );;
      })      
    })

    it('should load data from storage', function() {
      spyOn(storage, 'loadView');
      view.uid = '45fsgs45gh';

      view.load();

      expect(storage.loadView).toHaveBeenCalledWith('45fsgs45gh', jasmine.any(Function));
    })

    describe('with explicit storage ofload', function() {
      it('should directly call getEventsByName', function() {
        spyOn(storage, 'loadView');
        view.uid = '45fsgs45gh';

        view.load(true);

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
        view.load();

        expect(view.data).toEqual({ foo : 'bar' })
      })

      it('should store data to the view', function() {
        view.load();

        expect(view.lastEvent).toEqual(1325721336913);
      })


      it('should load events increment data from repository', function() {
        view.load();

        expect(repository.getEventsByName).toHaveBeenCalledWith( 'foo', 1325721336914, jasmine.any(Function) );
      })


      it( 'should call apply, for all events', function() {
        var event = {foo: 'bar'};

        spyOn(view, 'apply');
        repository.getEventsByName.andCallFake(function(names, from, callback) {
          callback([event]);
        }); 

        view.load();

        expect( view.apply ).toHaveBeenCalledWith( event, jasmine.any(Function) );    
      })

      it( 'should store view if events increment was loaded', function() {
        var event = {foo: 'bar'};

        spyOn(view, 'apply').andCallFake(function(event, callback) { 
          callback() 
        });

        repository.getEventsByName.andCallFake(function(names, from, callback) {
          callback([event]);
        }); 

        spyOn(storage, 'storeView');

        view.load();

        expect( storage.storeView ).toHaveBeenCalledWith(view);  
      })

      it( 'should not store view if snapshooting is disabled', function() {
        var event = {foo: 'bar'};

        spyOn(view, 'apply').andCallFake(function(event, callback) { 
          callback() 
        });
        
        repository.getEventsByName.andCallFake(function(names, from, callback) {
          callback([event]);
        }); 

        spyOn(storage, 'storeView');

        view.snapshots = false;

        view.load();

        expect( storage.storeView ).not.toHaveBeenCalled();
      })

      it( 'should call callback if specified', function() {
        this.handler = function() {}
        spyOn( this, 'handler')

        view.load(this.handler);

        expect( this.handler ).toHaveBeenCalled();  
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

      MyView.prototype.onMyEvent = function() {}
      spyOn(view, 'onMyEvent');

      view.apply(event, f);

      expect(view.onMyEvent).toHaveBeenCalledWith(event, f);
    })
  })
})