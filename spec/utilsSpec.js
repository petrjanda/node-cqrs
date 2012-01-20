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

  describe('.extendable', function() {
    var Base;

    beforeEach(function() {
      Base = function() {}
      Base.prototype.foo = function() {}
    })

    it('should define extend method', function() {
      utils.extendable(Base);

      expect(typeof Base.extend).toEqual('function');
    })

    it('.extend should accept prototype param', function() {
      utils.extendable(Base);

      var Foo = Base.extend(function(param) {
        this.param = param;
      });

      var bar = new Foo('blah');

      expect(bar.param).toEqual('blah');
    })

    it('.extend create constructor which call base constructor', function() {
      Base = function() { this.baseVar = true };

      utils.extendable(Base);

      var Foo = Base.extend();

      var bar = new Foo('blah');

      expect(bar.baseVar).toEqual(true);
    })

    it('.extend should all properties from Base prototype', function() {
      utils.extendable(Base);

      var Foo = Base.extend();

      expect(Foo.prototype.foo).toEqual(Base.prototype.foo);
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