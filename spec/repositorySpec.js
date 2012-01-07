var Repository = require('../lib/repository');

describe('Repository', function() {
  it('should exists', function() {
    expect(Repository).toBeDefined();
    expect(typeof Repository).toEqual('function');
  })
})