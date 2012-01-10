var util = require('util'),
    couchdb = require('../lib/repository/couchdb').getInstance(),
    repository = require('../lib/repository').getInstance(),
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

  describe('.constructor', function() {

    it( 'should load data from repository', function() {
      view = new MyView();

      expect(repository.getEventsByName).toHaveBeenCalledWith( 'foo', jasmine.any(Function) );
    })

    it( 'should call apply, for all events', function() {
      var event;

      runs(function() {
        event = {name: 'foo'};

        repository.getEventsByName.andCallFake(function(id, callback) {
          setTimeout(function() {
            callback([event]);
          }, 10);
        });      

        view = new MyView();
        spyOn(view, 'apply');
      })

      waits(15)

      runs(function() {
        expect( view.apply ).toHaveBeenCalledWith( event );    
      })
    })

    it( 'should call callback if specified', function() {
      this.handler = function() {}

      spyOn( this, 'handler')
      view = new MyView(this.handler);

      expect( this.handler ).toHaveBeenCalled();  
    })
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