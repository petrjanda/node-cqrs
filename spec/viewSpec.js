var util = require('util'),
    couchdb = require('../lib/repository/couchRepository').getInstance(),
    repository = require('../lib/repository').getInstance(),
    storage = require('../lib/storage/couch').getInstance(),
    View = require('../lib/view');

describe('View', function() {
  var view, MyView;

  beforeEach(function() {
    repository.strategy = couchdb;

    MyView = function(callback) {
      View.call(this, 'foo', callback);
    }

    util.inherits(MyView, View);

    spyOn(repository, 'getEventsByName').andCallFake(function(names, callback) {
      callback([]);
    });      

    view = new MyView();
  })

  describe('.load', function() {

    it('should load data from storage', function() {
      spyOn(storage, 'loadView');
      view.uid = '45fsgs45gh';

      view.load();

      expect(storage.loadView).toHaveBeenCalledWith('45fsgs45gh', jasmine.any(Function));
    })

    // it( 'should load data from repository', function() {
    //   view.load();

    //   expect(repository.getEventsByName).toHaveBeenCalledWith( 'foo', jasmine.any(Function) );
    // })

    // it( 'should call apply, for all events', function() {
    //   var event = {foo: 'bar'};

    //   spyOn(view, 'apply');
    //   repository.getEventsByName.andCallFake(function(names, callback) {
    //     callback([event]);
    //   }); 

    //   view.load();

    //   expect( view.apply ).toHaveBeenCalledWith( event );    
    // })

    // it( 'should call callback if specified', function() {
    //   this.handler = function() {}
    //   spyOn( this, 'handler')

    //   view.load(this.handler);

    //   expect( this.handler ).toHaveBeenCalled();  
    // })
  })
  
  describe('.apply', function() {

    it('should call raise error if handler is missing', function() {
      var event = {name: 'myEvent'};

      expect(function(){ view.apply(event) }).toThrow('There is no handler for \'MyEvent\' event!');
    })

    it('shoud call appropriate handler', function() {
      var event = {name: 'myEvent'};
      MyView.prototype.onMyEvent = function() {}
      spyOn(view, 'onMyEvent');

      view.apply(event);

      expect(view.onMyEvent).toHaveBeenCalledWith(event);
    })
  })
})