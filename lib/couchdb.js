var http = require('http');

module.exports = CouchDb = function() {
  this.options = {
    host: 'localhost',
    port: 5984
  };
}

CouchDb.prototype.request = function(options) {
  options = options || {};

  var params = this.options;
  params.method = options.method || 'GET';
  params.path = options.path || '/';

  var req = http.request(params, function(res) {
    
  });

  req.end();
}