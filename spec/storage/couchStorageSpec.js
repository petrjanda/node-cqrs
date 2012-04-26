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
      spyOn(Date.prototype, 'getTime').andCallFake(function() { return 123456; })

      couchStorage.storeView(view);

      expect(couchStorage.createDocument).toHaveBeenCalledWith('{"viewId":1,"type":"view","lastEvent":12,"time":123456,"data":"foo"}');
    })
  })

  describe('.deleteView', function() {
    it('should call deleteDocument', function() {
      var data = '{"total_rows":40,"offset":2,"rows":[{"id":"e9f59b5f8c965ebce700eeec1baf7a60","key":["1j0ddsesdfsfdo0m7",1326500825084],"value":{"_id":"e9f59b5f8c965ebce700eeec1baf7a60","_rev":"1-0145acc24d7c96db4d8ef260ad4afec4","viewId":"1j0ddsesdfsfdo0m7","type":"view","lastEvent":1326500821237,"time":1326500825084,"data":{"total":1054078}}}]}';

      spyOn(couchStorage, 'request').andCallFake(function(id, callback) {
        callback(data);
      })

      spyOn(couchStorage, 'deleteDocument');

      couchStorage.purgeView('1j0ddsesdfsfdo0m7');


      expect(couchStorage.request).toHaveBeenCalledWith({ method : 'GET', path : '/cqrs/_design/cqrs/_view/viewSnapshot?startkey=["1j0ddsesdfsfdo0m7",999999999999999999]&endkey=["1j0ddsesdfsfdo0m7",0]&limit=1&descending=true' }, jasmine.any(Function));
      expect(couchStorage.deleteDocument).toHaveBeenCalledWith('e9f59b5f8c965ebce700eeec1baf7a60');
    })
  })

  describe('.loadView', function() {
    it('should call request', function() {
      spyOn(couchStorage, 'request');

      couchStorage.loadView('f4f5g8e76tko');

      expect(couchStorage.request).toHaveBeenCalledWith({ method : 'GET', path : '/cqrs/_design/cqrs/_view/viewSnapshot?startkey=["f4f5g8e76tko",999999999999999999]&endkey=["f4f5g8e76tko",0]&limit=1&descending=true' }, jasmine.any(Function));
    })

    it('should return null if view doesnt exist', function() {
      var data = '{"error":"not_found","reason":"missing"}',
          foo = {f: function() {}};

      spyOn(foo, 'f');
      spyOn(couchStorage, 'request').andCallFake(function(id, callback) {
        callback(data);
      })

      couchStorage.loadView('f8s7h5dggs', foo.f);      
      
      expect(foo.f).toHaveBeenCalledWith(null);
    })

    it('should parse the returned data', function() {
      var data = '{"total_rows":40,"offset":2,"rows":[{"id":"e9f59b5f8c965ebce700eeec1baf7a60","key":["1j0ddsesdfsfdo0m7",1326500825084],"value":{"_id":"e9f59b5f8c965ebce700eeec1baf7a60","_rev":"1-0145acc24d7c96db4d8ef260ad4afec4","viewId":"1j0ddsesdfsfdo0m7","type":"view","lastEvent":1326500821237,"time":1326500825084,"data":{"total":1054078}}}]}',
          foo = {f: function() {}};

      spyOn(foo, 'f');
      spyOn(couchStorage, 'request').andCallFake(function(id, callback) {
        callback(data);
      })

      couchStorage.loadView('f8s7h5dggs', foo.f);      
      
      expect(foo.f).toHaveBeenCalledWith({
        viewId : '1j0ddsesdfsfdo0m7', 
        lastEvent : 1326500821237, 
        time: 1326500825084,
        data : { total : 1054078 }
      });
    })
  })
})