var CouchStorage = require('../../lib/storage/couchStorage'),
    utils = require('../../lib/utils'),
    jasmine = require('jasmine-node');

describe('CouchStorage', function() {
  var couchStorage,

  validData = JSON.stringify({
    "total_rows":40,
    "offset":2,
    "rows": [
      {
        "id":"e9f59b5f8c965ebce700eeec1baf7a60",
        "key": ["1j0ddsesdfsfdo0m7",1326500825084],
        "value":{
          "_id":"e9f59b5f8c965ebce700eeec1baf7a60",
          "_rev":"1-0145acc24d7c96db4d8ef260ad4afec4",
          "viewId":"1j0ddsesdfsfdo0m7",
          "type":"view",
          "lastEvent":1326500821237,
          "time":1326500825084,
          "data":{"total":1054078}
        }
      }
    ]
  }),

  errorData = JSON.stringify({
    error: "not_found",
    reason: "missing"
  });

  function fakeRequest(data) {
    spyOn(couchStorage, 'request').andCallFake(function(id, callback) {
      callback(data);
    })  
  }

  function viewPath(id) {
    return '/cqrs/_design/cqrs/_view/viewSnapshot?startkey=["' + 
      id + '","999999999999999999"]&endkey=["' + 
      id + '","0"]&limit=1&descending=true';
  }

  beforeEach(function() {
    couchStorage = CouchStorage.createStorage();  
  })

  describe('instance', function() {
    it('should get instance of CouchStorage', function() {
      var couchStorage = CouchStorage.createStorage()
      expect(typeof couchStorage.request).toEqual('function');
    })

    it('should return just one instance', function() {
      expect(CouchStorage.createStorage()).toEqual(CouchStorage.createStorage())
    })
  })

  describe('.storeView', function() {
    it('should call createDocument', function() {
      var view = {uid: 'name', lastEvent: 12, data: 'foo'};
      spyOn(couchStorage, 'createDocument');
      spyOn(utils, 'uuid').andReturn(123456);

      couchStorage.storeView(view);

      expect(couchStorage.createDocument).toHaveBeenCalledWith(
        'name-123456', 
        {
          viewId: 'name',
          type: "view",
          lastEvent: 12,
          time: 123456,
          data: "foo"
        },
        jasmine.any(Function)
      );
    })
  })

  describe('.deleteView', function() {
    it('should call deleteDocument', function() {
      fakeRequest(validData);
      spyOn(couchStorage, 'deleteDocument');

      couchStorage.purgeView('1j0ddsesdfsfdo0m7');

      expect(couchStorage.deleteDocument).toHaveBeenCalledWith(
        'e9f59b5f8c965ebce700eeec1baf7a60', 
        '1-0145acc24d7c96db4d8ef260ad4afec4'
      );

      expect(couchStorage.request).toHaveBeenCalledWith({ 
        method : 'GET', 
        path : viewPath('1j0ddsesdfsfdo0m7') }, 
        jasmine.any(Function)
      );
    })

    it('should not call deleteDocument if no previous view exists', function() {
      fakeRequest(errorData);
      spyOn(couchStorage, 'deleteDocument');

      couchStorage.purgeView('1j0ddsesdfsfdo0m7');

      expect(couchStorage.deleteDocument).not.toHaveBeenCalled();
      expect(couchStorage.request).toHaveBeenCalledWith({
        method : 'GET', 
        path : viewPath('1j0ddsesdfsfdo0m7') }, 
        jasmine.any(Function));
    })
  })

  describe('.loadView', function() {

    it('should call request', function() {
      spyOn(couchStorage, 'request');

      couchStorage.loadView('f4f5g8e76tko');

      expect(couchStorage.request).toHaveBeenCalledWith({ 
        method : 'GET', 
        path : viewPath('f4f5g8e76tko') }, 
        jasmine.any(Function));
    })

    it('should return null if view doesnt exist', function() {
      var foo = {f: function() {}};

      spyOn(foo, 'f');
      fakeRequest(errorData);

      couchStorage.loadView('f8s7h5dggs', foo.f);      
      
      expect(foo.f).toHaveBeenCalledWith(null);
    })

    it('should parse the returned data', function() {
      var foo = {f: function() {}};

      spyOn(foo, 'f');
      fakeRequest(validData);

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