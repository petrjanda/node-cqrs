var http = require('http');

module.exports = CouchDb = function(database) {
  this.database = database;
  this.options = {
    host: 'localhost',
    port: 5984
  };
}

CouchDb.prototype.createDocument = function(data) {
  var uuid = 'foo';

  this.request({
    method: 'PUT',
    path: '/' + this.database + '/' + uuid,
    data: data
  });
}

CouchDb.prototype.request = function(options) {
  options = options || {};

  var params = this.options;
  params.method = options.method || 'GET';
  params.path = options.path || '/';

  var req = http.request(params, function(res) {
    console.log(res);
  });

  if(options.data) {
    req.write(options.data);
  }

  req.end();
}