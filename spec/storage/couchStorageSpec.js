var CouchStorage = require('../../lib/storage/couch'),
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
  })
})