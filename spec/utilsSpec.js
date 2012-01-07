var utils = require('../lib/utils');

describe('Utils', function() {
  
  describe('.singleton', function() {
    var Base, base;

    beforeEach(function() {
      Base = function() {};
      Base.prototype.foo = function() { }

      base = new Base();
    })

    it('should create getInstance method on base', function() {
      utils.singleton(Base);

      expect(typeof Base.getInstance).toBe('function');
    })

    it('Base.getInstance should return same base instance', function() {
      utils.singleton(Base);

      var instance = Base.getInstance();

      expect(Base.getInstance()).toBe(instance);
      expect(typeof Base.getInstance().foo).toEqual('function');
    })    
  })
})