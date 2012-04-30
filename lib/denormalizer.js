var Denormalizer = module.exports = function() {
  this.views = {};
  this.eventsMap = {};
}

/*
 * Register a given view in the pool. 
 *
 * @param {Number} Unique view identifier.
 * @param {Array} List of event names the view is interested in.
 */
Denormalizer.prototype.registerView = function(view) {
  var self = this;

  if(this.views[view.uid]) {
    throw new Error('View with a given name is already registered!');
  }

  this.views[view.uid] = view;

  view.eventNames.forEach(function(event) {
    self.eventsMap[event] = self.eventsMap[event] || [];
    self.eventsMap[event].push(view);
  })
}

/*
 * Update views, which are interested in the event.
 *
 * @param {Object} Event data.
 */
Denormalizer.prototype.updateViews = function(event) {
  this.eventsMap[event].forEach(function(view) {
    view.build();
  })
}

/*
 * Build a given view using the most recent events.
 *
 * @param {Object} Event data.
 */
Denormalizer.prototype.build = function(uid) {
  var view = this.views[uid];
  if(!view) {
    throw new Error('View is not registered!');
  }

  view.build();
}