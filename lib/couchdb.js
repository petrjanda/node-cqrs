var http = require('http');

module.exports = CouchDb = function(database) {
  this.database = database;
  this.options = {
    host: 'localhost',
    port: 5984
  };
}

CouchDb.prototype.getUuid = function(callback) {
  this.request({
    method: 'GET',
    path: '/_uuids'
  }, function(data) {
    callback(JSON.parse(data).uuids[0]);
  });
}

CouchDb.prototype.createDocument = function(data, callback) {
  var self = this;

  this.getUuid(function(uuid) {
    self.request({
      method: 'PUT',
      path: '/' + self.database + '/' + uuid,
      data: data
    }, callback);
  });
}

CouchDb.prototype.request = function(options, callback) {
  options = options || {};

  var params = this.options,
      buffer = '';
  params.method = options.method || 'GET';
  params.path = options.path || '/';

  var req = http.request(params, function(res) {
    res.on('data', function(chunk) {
      buffer += chunk;  
    })

    res.on('end', function(chunk) {
      if(chunk) {
        buffer += chunk;
      }

      callback(buffer);
    })
  });

  if(options.data) {
    req.write(options.data);
  }

  req.end();
}