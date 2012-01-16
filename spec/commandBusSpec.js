var CommandBus = require('../lib/commandBus');

describe('CommandBus', function() {
  var commandBus;

  beforeEach(function() {
    commandBus = new CommandBus();
  })

  describe('instance', function() {
    it('should get instance of CouchStorage', function() {
      var commandBus = CommandBus.getInstance()
      expect(typeof commandBus.execute).toEqual('function');
    })

    it('should return just one instance', function() {
      expect(CommandBus.getInstance()).toEqual(CommandBus.getInstance())
    })
  })

  it('should initialize empty handlers list', function() {
    expect(commandBus.handlers).toEqual({});
  })

  describe('.registerHandler', function() {
    it('should register handler function', function() {
      var f = function() {}

      commandBus.registerHandler('event', f);

      expect(commandBus.handlers['event']).toEqual(f);
    })  

    it('should accept only function as handler', function() {
      expect(function() { 
        commandBus.registerHandler('event', 'handler');
      }).toThrow('Handler has to be function!');
    })  

  })

  describe('.execute', function() {
    it('should throw an error in case handler doesnt exist', function() {
      expect(function() { 
        commandBus.execute('command'); 
      }).toThrow('Handler for \'command\' doesn\'t exist!');
    })

    it('should call handler if available', function() {
      commandBus.handlers['foo'] = function() {}
      spyOn(commandBus.handlers, 'foo');

      commandBus.execute('foo', {foo: 'bar'});

      expect(commandBus.handlers['foo']).toHaveBeenCalledWith({foo: 'bar'});
    })

    it('should pass callback if supplied', function() {
      var cb, f = function() {}

      commandBus.handlers['foo'] = function(attrs, callback) {
        cb = callback;
      }

      commandBus.execute('foo', {foo: 'bar'}, f);

      expect(cb).toEqual(f);
    })
  })
  
})