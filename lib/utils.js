var util = require('util');

module.exports.singleton = function(base) {
  base.getInstance = function() {
    if(!this.instance)
      this.instance = new base();

    return this.instance;
  }
}

module.exports.delegators = function(base, target, method) {
  base.prototype[method] = function() {
    this[target][method].apply(this[target], arguments);
  }
}

module.exports.inherits = util.inherits;