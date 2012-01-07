module.exports.singleton = function(base) {
  base.getInstance = function() {
    if(!this.instance)
      this.instance = new base();

    return this.instance;
  }
}