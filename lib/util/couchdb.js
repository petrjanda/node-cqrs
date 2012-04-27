var http = require('http'),
    nano = require('nano');

/*
 * Whole class would be replaced by nano!
 * @depricated
 */

module.exports = CouchDb = function(options) {
  options = options || {};

  this.database = options.database || 'cqrs';

  this.host = options.host || 'localhost';

  this.port = options.port || 5984;

  this._db = nano('http://' + this.host + ':' + this.port + '/' + this.database);
}

/*
 * Documents are CouchDB’s central data structure. The idea behind a document 
 * is, unsurprisingly, that of a real-world document—a sheet of paper such as 
 * an invoice, a recipe, or a business card. 
 *
 * @param {String} Document name.
 * @param {String} Document content.
 * @param {Function} Function to be called when document is created.
 */
CouchDb.prototype.createDocument = function(id, data, callback) {
  this._db.insert(data, id, callback);
}

CouchDb.prototype.deleteDocument = function(id, rev, callback) {
  this._db.destroy(id, rev, callback);
}

CouchDb.prototype._documentPath = function(id) {
  return '/' + this.database + '/' + id;
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

  var params = { host: this.host, port: this.port},
      buffer = '';

  params.method = options.method || 'GET';
  params.path = options.path || '/';

  if(this.user && this.password) {
    params.headers = {};
    params.headers['Authorization'] = "Basic " + new Buffer(this.user + ":" + this.password).toString('base64');
  }

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