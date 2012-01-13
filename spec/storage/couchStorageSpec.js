var CouchStorage = require('../../lib/storage/couchStorage'),
    jasmine = require('jasmine-node');

describe('CouchStorage', function() {
  var couchStorage;

  beforeEach(function() {
    couchStorage = new CouchStorage();  
  })

  describe('instance', function() {
    it('should get instance of CouchStorage', function() {
      var couchStorage = CouchStorage.getInstance()
      expect(typeof couchStorage.request).toEqual('function');
    })

    it('should return just one instance', function() {
      expect(CouchStorage.getInstance()).toEqual(CouchStorage.getInstance())
    })
  })

  describe('.storeView', function() {
    it('should call createDocument', function() {
      var view = {uid: 1, lastEvent: 12, data: 'foo'};
      spyOn(couchStorage, 'createDocument');

      couchStorage.storeView(view);

      expect(couchStorage.createDocument).toHaveBeenCalledWith('{"viewId":1,"type":"view","lastEvent":12,"data":"foo"}');
    })
  })

  describe('.loadView', function() {
    it('should call request', function() {
      spyOn(couchStorage, 'request');

      couchStorage.loadView('f4f5g8e76tko');

      expect(couchStorage.request).toHaveBeenCalledWith({ method : 'GET', path : '/cqrs/f4f5g8e76tko' }, jasmine.any(Function));
    })

    it('should parse the returned data', function() {
      var data = '{"_id":"e0eab491a60bd3d4183751ae407915b3","_rev":"1-97e88760a5636ac689a479b074661209","uid":"f8s7h5dggs","type":"view","lastEvent":1325721336913,"data":{"foo":"bar"}}',
          foo = {f: function() {}};

      spyOn(foo, 'f');
      spyOn(couchStorage, 'request').andCallFake(function(id, callback) {
        callback(data);
      })

      couchStorage.loadView('f8s7h5dggs', foo.f);      
      
      expect(foo.f).toHaveBeenCalledWith({
        uid : 'f8s7h5dggs', 
        lastEvent : 1325721336913, 
        data : { foo : 'bar' }
      });
    })
  })
})