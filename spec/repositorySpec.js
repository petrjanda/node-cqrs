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

  it('should delegate storeEvent method to strategy', function() {
    spyOn(repository.strategy, 'storeEvent');

    repository.storeEvent();

    expect(repository.strategy.storeEvent).toHaveBeenCalled();
  })

  it('should delegate getEventsByAggregate method to strategy', function() {
    spyOn(repository.strategy, 'getEventsByAggregate');

    repository.getEventsByAggregate();

    expect(repository.strategy.getEventsByAggregate).toHaveBeenCalled();
  })
})