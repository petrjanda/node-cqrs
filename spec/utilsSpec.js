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

  describe('.delegators', function() {
    var Base, base;

    beforeEach(function() {
      Base = function() {
        this.receiver = {
          foo: function() {
            
          }
        }
      };
      
      base = new Base();
    })

    it('should define delegate method', function() {
      utils.delegators(Base, 'receiver', 'foo');
      spyOn(base.receiver, 'foo');

      base.foo();

      expect(base.receiver.foo).toHaveBeenCalled();

    })
  })

})