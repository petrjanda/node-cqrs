var Denormalizer = require('../lib/denormalizer');

describe('Denormalizer', function() {
  var denormalizer = null;

  beforeEach(function() {
    denormalizer = new Denormalizer();
  })

  describe('#registerView', function() {

    it('should store view in the list of views', function() {
      var view = new ViewBuilder('foo', ['bar', 'baz']);

      denormalizer.registerView(view);

      expect(denormalizer.views['foo']).toEqual(view);
    })

    it('should store view to the events map', function() {
      var view = new ViewBuilder('foo', ['bar', 'baz']);

      denormalizer.registerView(view);

      expect(denormalizer.eventsMap['bar']).toEqual([view]);
      expect(denormalizer.eventsMap['baz']).toEqual([view]);
    })

    it('should throw an exception if the view already exists', function() {
      var view = new ViewBuilder('foo', ['bar', 'baz']);

      denormalizer.registerView(view);

      expect(function() { 
        denormalizer.registerView(view);
      }).toThrow('View with a given name is already registered!');
    })
  })

  describe('#updateViews', function() {
    it('should trigger .build function for all registered views', function() {
      var view = new ViewBuilder('foo', []);
      spyOn(view, 'build');

      denormalizer.registerView(view);

      denormalizer.updateAllViews();

      expect(view.build).toHaveBeenCalled();
    })
  })

  describe('#updateAllViews', function() {
    it('should trigger .build function for all registered views', function() {
      var view = new ViewBuilder('foo', ['bar', 'baz']);
      spyOn(view, 'build');

      denormalizer.registerView(view);

      denormalizer.updateViews('baz');

      expect(view.build).toHaveBeenCalled();
    })
  })

  describe('#build', function() {
    it('should trigger .load function for the view if exists', function() {
      var view = new ViewBuilder('foo', ['bar', 'baz']);
      spyOn(view, 'build');

      denormalizer.registerView(view);

      denormalizer.build('foo');

      expect(view.build).toHaveBeenCalled();
    })

    it('should throw exception if view doesnt exist', function() {
      expect(function() { 
        denormalizer.build('foo');
      }).toThrow('View is not registered!');
    })
  })
})