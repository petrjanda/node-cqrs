var http = require('http'),
    utils = require('../../lib/utils'),
    jasmine = require('jasmine-node'),
    CouchDb = require('../../lib/repository/couchRepository'),
    EventEmitter = require('events').EventEmitter;

describe('CouchRepository', function() {
  var couchdb;

  beforeEach(function() {
    couchdb = CouchDb.createRepository({ database: 'cqrs' });
  })

  describe('.createRepository', function() {
    it('should get instance of couchdb', function() {
      var couchdb = CouchDb.createRepository({ database: 'cqrs' });

      expect(typeof couchdb._db).toEqual('object');
    })

    it('should return just one instance', function() {
      var couch1 = CouchDb.createRepository({ database: 'cqrs' });
          couch2 = CouchDb.createRepository({ database: 'cqrs' });

      expect(couch1).toEqual(couch2);
    })
  })

  describe('constructor', function() {

    it('should store database name', function() {
      expect(couchdb.database).toEqual('cqrs');
    })

    it('host should be default to localhost', function() {
      expect(couchdb.host).toEqual('localhost');
    })

    it('port should be default to localhost', function() {
      expect(couchdb.port).toEqual(5984);
    })    
  })

  describe('storeEvent', function() {
    it('should call create document', function() {
      spyOn(couchdb, 'createDocument');
      spyOn(utils, 'uuid').andCallFake(function() { return 123456; })

      couchdb.storeEvent(1, 'user:created', {foo: 'bar'});

      expect(couchdb.createDocument).toHaveBeenCalledWith(123456, JSON.stringify({
        aggregateId: 1,
        name: 'user:created',
        type: 'event',
        time: 123456,
        attrs: {foo: 'bar'}
      }), jasmine.any(Function));
    })

    it('should trigger callback if specified', function() {
      var foo = {f: function() {}}
      spyOn(couchdb, 'createDocument').andCallFake(function(id, data, callback) { callback() })
      spyOn(foo, 'f');

      couchdb.storeEvent(1, 'user:created', {foo: 'bar'}, foo.f);

      expect(foo.f).toHaveBeenCalled();
    })
  })

  describe('getEventsByAggregate', function() {
    it('should call request', function() {
      spyOn(couchdb, 'request');

      couchdb.getEventsByAggregate(1, function() {});

      expect(couchdb.request).toHaveBeenCalledWith({
        method : 'GET',
        path : '/cqrs/_design/cqrs/_view/aggregate?startkey=["1","0"]&endkey=["1","9999999999999999"]'
      }, jasmine.any(Function));
    })

    it('should call parseEvents', function() {
      var f = function() {}
      spyOn(couchdb, 'parseEvents');
      spyOn(couchdb, 'request').andCallFake(function(data, callback) {
        callback('data');
      })

      couchdb.getEventsByAggregate(1, f);

      expect(couchdb.parseEvents).toHaveBeenCalledWith('data', f);
    })
  })

  describe('getEventsByType', function() {
    beforeEach(function() {
      spyOn(couchdb, 'request').andCallFake(function(data, callback) {
        callback('{"rows": [{"_id":1, "_ref":1, "value": {"foo": "bar"}}]}');
      })
    })

    it('should call request', function() {
      couchdb.getEventsByName('foo', 1000, function() {});

      expect(couchdb.request).toHaveBeenCalledWith({
        method: 'GET', 
        path: '/cqrs/_design/cqrs/_view/name?startkey=["foo","1000"]&endkey=["foo","9999999999999999"]'
      }, jasmine.any(Function));
    })

    describe('with event list', function() {
      it('should call request for each event', function() {
        couchdb.getEventsByName(['foo', 'bar'], 0, function() {});

        expect(couchdb.request).toHaveBeenCalledWith({
          method: 'GET', 
          path: '/cqrs/_design/cqrs/_view/name?startkey=["foo","0"]&endkey=["foo","9999999999999999"]'
        }, jasmine.any(Function));

        expect(couchdb.request).toHaveBeenCalledWith({
          method: 'GET', 
          path: '/cqrs/_design/cqrs/_view/name?startkey=["bar","0"]&endkey=["bar","9999999999999999"]'
        }, jasmine.any(Function));
      })

      it('should call callback just once', function() {
        var foo = {f: function() {}}
        spyOn(foo, 'f');

        couchdb.getEventsByName(['foo', 'bar'], 0, foo.f);

        expect(foo.f).toHaveBeenCalled();
        expect(foo.f.callCount).toEqual(1);
      })
    })


    it('should call parseEvents', function() {
      var f = function() {}
      spyOn(couchdb, 'parseEvents');

      couchdb.getEventsByName('foo', 0, f);

      expect(couchdb.parseEvents).toHaveBeenCalledWith('{"rows": [{"_id":1, "_ref":1, "value": {"foo": "bar"}}]}', f);
    })
  })
})