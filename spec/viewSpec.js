var util = require('util'),
    storage = require('../lib/storage/couchStorage').createStorage(),
    View = require('../lib/view');

describe('View', function() {
  var view, MyView;

  beforeEach(function() {
    MyView = function(callback) {
      View.call(this, 'myview', 'foo', callback);
    }

    util.inherits(MyView, View);

    view = new MyView();
  })

  describe('constructor', function() {
    it('should initialize view id', function() {
      expect(view.uid).toEqual('myview');
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
})