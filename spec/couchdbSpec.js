var http = require('http'),
    jasmine = require('jasmine-node'),
    CouchDb = require('../lib/couchdb');

describe('couchdb', function() {
  var couchdb;

  beforeEach(function() {
    couchdb = new CouchDb('cqrs');
  })

  it('should store database name', function() {
    expect(couchdb.database).toEqual('cqrs');
  })

  it('host should be default to localhost', function() {
    expect(couchdb.options.host).toEqual('localhost');
  })

  it('port should be default to localhost', function() {
    expect(couchdb.options.port).toEqual(5984);
  })

  describe('createDocument', function() {
    it('should call proper request', function() {
      var data = JSON.stringify({ foo: 'bar' }),
      options = { path: '/cqrs/foo', method: 'PUT', data: data };
      spyOn(couchdb, 'request');

      couchdb.createDocument(data)

      expect(couchdb.request).toHaveBeenCalledWith(options);
    })
  })

  describe('request', function() {
    var req;

    beforeEach(function() {
      req = Object.create({
        end: function() {},
        write: function() {}
      });

      spyOn(http, 'request').andReturn(req);
    })

    it('should call http.request with valid params', function() {
      couchdb.request();

      expect(http.request).toHaveBeenCalledWith(couchdb.options, jasmine.any(Function));
    })

    it('should setup proper default options', function() {
      couchdb.options = {};

      couchdb.request();

      expect(http.request).toHaveBeenCalledWith({method: 'GET', path: '/'}, jasmine.any(Function));
    })

    it('should call post', function() {
      couchdb.options = {};

      couchdb.request({method: 'POST'});

      expect(http.request).toHaveBeenCalledWith({method: 'POST', path: '/'}, jasmine.any(Function));
    })    

    it('should call proper url', function() {
      couchdb.options = {};

      couchdb.request({path: '/foo'});

      expect(http.request).toHaveBeenCalledWith({method: 'GET', path: '/foo'}, jasmine.any(Function));
    }) 

    it('should end request', function() {
      spyOn(req, 'end');

      couchdb.request();

      expect(req.end).toHaveBeenCalled();
    });

    it('should write data to request if specified', function() {
      spyOn(req, 'write');

      couchdb.request({data: 'foo'});

      expect(req.write).toHaveBeenCalledWith('foo');
    });  
    
    describe('response', function() {
      
      it('')

    });  
  });
});