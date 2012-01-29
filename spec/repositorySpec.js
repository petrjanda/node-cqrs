var Repository = require('../lib/repository');

describe('Repository', function() {
  var strategy, repository;

  beforeEach(function() {
    strategy = {
      storeEvent: function() {},
      getEventsByAggregate: function() {}
    }

    repository = new Repository(strategy);
  })

  it('should exists', function() {
    expect(Repository).toBeDefined();
    expect(typeof Repository).toEqual('function');
  })

  it('should store the strategy object', function() {
    expect(repository.strategy).toEqual(strategy);
  })

  it('should be singleton', function() {
    expect(typeof Repository.getInstance).toBe('function');
  })


  describe('.storeEvent', function() {
    it('should delegate storeEvent method to strategy', function() {
      spyOn(repository.strategy, 'storeEvent');

      repository.storeEvent();

      expect(repository.strategy.storeEvent).toHaveBeenCalled();
    })    

    it('should trigger handlers', function() {
      var foo = {f: function() {}},
          event = {foo: 'bar'};

      spyOn(foo, 'f');
      spyOn(repository.strategy, 'storeEvent').andCallFake(function(aggregateId, name, attrs, callback) {
        callback(event);
      })

      repository.on('foo', foo.f);
      repository.storeEvent(1, 'foo');

      expect(foo.f).toHaveBeenCalledWith(event);
    })

    it('should trigger callback', function() {
      var foo = {f: function() {}},
          event = {foo: 'bar'};

      spyOn(foo, 'f');
      spyOn(repository.strategy, 'storeEvent').andCallFake(function(aggregateId, name, attrs, callback) {
        callback(event);
      })

      repository.storeEvent(1, 'foo', {}, foo.f);

      expect(foo.f).toHaveBeenCalledWith(event);
    })
  })

  it('should delegate getEventsByAggregate method to strategy', function() {
    spyOn(repository.strategy, 'getEventsByAggregate');

    repository.getEventsByAggregate();

    expect(repository.strategy.getEventsByAggregate).toHaveBeenCalled();
  })

  describe('.handlers', function() {
    it('should have empty handler on start', function() {
      expect(repository.handlers).toEqual({});
    })

    it('should add event to handlers', function() {
      var f = function() {};
      
      repository.on('foo', f);

      expect(repository.handlers['foo']).toEqual([f]);
    })

    it('should allow add of multiple handlers for the same event', function() {
      var f = function() {},
          f2 = function() {};
      
      repository.on('foo', f);
      repository.on('foo', f2);

      expect(repository.handlers['foo']).toEqual([f, f2]);
    })

    it('should not allow to add same handler twice for same event', function() {
      var f = function() {};
      
      repository.on('foo', f);
      repository.on('foo', f);

      expect(repository.handlers['foo']).toEqual([f]);
    })

    it('should not allow to add same handler for different events', function() {
      var f = function() {};
      
      repository.on('foo', f);
      repository.on('foobar', f);

      expect(repository.handlers['foo']).toEqual([f]);
      expect(repository.handlers['foobar']).toEqual([f]);
    })    
  })
})