redis = require('redis');

module.exports = var Storage = function() {
  this.edb = redis.createClient( 9023, 'perch.redistogo.com' );
  this.edb.auth( '5f217db27a02ed75e2a00ed37e2e7d45' );
}

Storage.prototype.storeEvent = function(data) {
  this.edb.incr( 'guid', function(err, value) {
    this.edb.set( 'event:' + value, data );  
  });
}