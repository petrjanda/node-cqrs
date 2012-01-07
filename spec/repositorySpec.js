var Repository = require('../lib/repository');

describe('Repository', function() {
  var repository;

  beforeEach(function() {
    repository = new Repository('foo');
  })

  it('should exists', function() {
    expect(Repository).toBeDefined();
    expect(typeof Repository).toEqual('function');
  })

  it('should store the strategy object', function() {
    expect(repository.strategy).toEqual('foo');
  })

  it('should be singleton', function() {
    expect(typeof Repository.getInstance).toBe('function');
  })
})