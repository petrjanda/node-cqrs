var http = require('http');

module.exports = CouchDb = function(database) {
  this.database = database;
  this.options = {
    host: 'localhost',
    port: 5984
  };
}

CouchDb.prototype.getUuid = function() {
  this.request({
    method: 'GET',
    path: '/_uuids'
  })
}

CouchDb.prototype.createDocument = function(data) {
  var uuid = this.getUuid();

  this.request({
    method: 'PUT',
    path: '/' + this.database + '/' + uuid,
    data: data
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
      buffer += chunk;
      callback(buffer);
    })
  });

  if(options.data) {
    req.write(options.data);
  }

  req.end();
}