var util = require('util'),
    repo = require('./repository').getInstance(),
    View = require('./view'),
    Storage = require('./storage/couchStorage');

module.exports = ViewBuilder = function(uid, eventNames) {

  View.call(this, uid, eventNames);
}

util.inherits(ViewBuilder, View);