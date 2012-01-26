var util = require('util'),
    microtime = require('microtime');

module.exports.uuid = function() {
  return microtime.now().toString() + Math.floor(Math.random() * 1000).toString();
}

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

/*
 * In order to optimize code repeatability, you can define extend method
 * which will work well with your prototype inharitance. You can pass
 * optional function as argument, which will be called imediatelly after
 * base class. The base prototype functions are copied to created object.
 * It works incremental way, so original prototype is not rewriten.
 *
 * Usage:
 * var Base = function() {}
 * util.extendable(Base)
 *
 * var Inherited = Base.extend(function() {
 *   // This function is called imediatelly after Base.
 *   // It gets all the new arguments as well.
 * })
 *
 * new Inherited('foo') // foo will be passed to base and your optional constructor.
 *
 * @param {Function} Base function.
 */
module.exports.extendable = function(base) {
  base.extend = function(constructor) {

    // Create new function, which inherits from base.
    var Extended = function() {
      base.apply(this, arguments);

      if(constructor) {
        constructor.apply(this, arguments);
      }
    }

    // Copy base prototype.
    for(var i in base.prototype) {
      Extended.prototype[i] = base.prototype[i];
    }

    return Extended;
  }
}

module.exports.inherits = util.inherits;