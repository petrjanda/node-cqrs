var http = require('http');

module.exports = CouchDb = function(database, options) {
  options = options || {}
  
  this.database = database || 'cqrs';
  this.options = {
    host: options.host || 'localhost',
    port: options.port || 5984
  };
}

/*
 * UUIDs are random numbers that have such a low collision probability that 
 * everybody can make thousands of UUIDs a minute for millions of years without
 * ever creating a duplicate.
 *
 * @param {Function} Function to be called when uuid is received.
 */
CouchDb.prototype.getUuid = function(callback) {
  this.request({
    method: 'GET',
    path: '/_uuids'
  }, function(data) {
    callback(JSON.parse(data).uuids[0]);
  });
}

/*
 * Documents are CouchDB’s central data structure. The idea behind a document 
 * is, unsurprisingly, that of a real-world document—a sheet of paper such as 
 * an invoice, a recipe, or a business card. 
 *
 * @param {String} Document content.
 * @param {Function} Function to be called when document is created.
 */
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

/*
 * Simple function to send synchronous HTTP requests. Because we have to get
 * full JSON data from couchdb before any additional processing, this method
 * buffer all the incoming data and trigger callback once the data is fully
 * loaded and ready.
 *
 * @param {Object} Request options.
 * @param {Function} Callback.
 */
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

      if(callback) {
        callback(buffer);
      }
    })
  });

  if(options.data) {
    req.write(options.data);
  }

  req.end();
}