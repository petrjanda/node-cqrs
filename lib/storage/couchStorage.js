var utils = require('../utils'),
    CouchDb = require('../util/couchdb');

/*
 * Storage is the system component, used to persist view layer snapshots. Main
 * motivation, is to lower the load for event storage and speed up the view
 * generate process, when client request comes. The storage is separate system
 * component and can be even implemented on different persistance system from
 * event storage.
 */
module.exports = CouchStorage = function() {
  CouchDb.call(this, 'cqrs');
}

utils.inherits(CouchStorage, CouchDb);
utils.singleton(CouchStorage);

/*
 * Method called to persist current view state, to the database snapshot.
 * Because of high concurrency, this method can be called even multiple times,
 * but system will take care, that most recent snapshot is always chosen, in
 * order to get data back.
 *
 * @param {View} View instance, to be snapshoted.
 */
CouchStorage.prototype.storeView = function(view) {
  this.createDocument(JSON.stringify({
    viewId: view.uid,
    type: 'view',
    lastEvent: view.lastEvent,
    time: new Date().getTime(),
    data: view.data
  }));
}

CouchStorage.prototype.purgeView = function(id) {
  var self = this;
  
  this._loadBareView(id, function(data) {
    self.deleteDocument(data._id);
  });
}

/*
 * Load most recent snapshot, for a given view.
 *
 * @param {String} Unique view identifier.
 * @param {Function} Callback function taking view data structure as param.
 */
CouchStorage.prototype.loadView = function(id, callback) {
  this._loadBareView(id, function(data) {
    if(data) {
      delete data._id;
      delete data._rev;
      delete data.type;

      callback(data);
      return;
    }
      
    callback(null);
  });
}

CouchStorage.prototype._loadBareView = function(id, callback) {
  this.request({
    method: 'GET',
    path: '/' + this.database + '/_design/cqrs/_view/viewSnapshot?startkey=["' + id + '",999999999999999999]&endkey=["' + id + '",0]&limit=1&descending=true'
  }, function(data) {
    data = JSON.parse(data);

    if(data.error || !data.rows[0]) {
      callback(null);
      return;
    }

    data = data.rows[0].value;

    callback(data);
  });
}