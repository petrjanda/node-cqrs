var util        = require('util'),
    Aggregate   = require('../../lib/aggregate');

module.exports = User = function( id, cb ) {
  Aggregate.call(this, id, cb);
}

util.inherits(User, Aggregate);

User.create = function( attrs ) {
  var user = new User( attrs.id, function() {
    this.create( attrs );
  }) 
}

//
// COMMANDS
//

User.prototype.create = function( attrs ) {
  // Do validations
  if( !attrs.id || !attrs.password || !attrs.name || !attrs.email ) {
    throw new Error( 'Attrs have to be specified!' );
  }

  this.emit('created', attrs);
}

User.prototype.login = function() {
  if( this._loggedIn ) {
    throw new Error( 'Already logged in' );
  }

  this.emit('loggedIn');
}

User.prototype.logout = function() {
  if( !this._loggedIn ) {
    throw new Error( 'Already logged out' );
  }

  this.emit('loggedOut');
}

User.prototype.updatePassword = function( currentPassword, password, passwordConfirmation ) {
  if( this._password == currentPassword && password == passwordConfirmation )
    throw new Error( 'Unauthorized' );

  this.emit('passwordUpdated', { password: password });
}



User.prototype.apply = function( event ) {
  switch(event.type) {
    case 'created':
      var data = event.attributes;
      this._loggedIn = false;
      this._password = data.password;
      this._name = data.name;
      this._email = data.email;
      break;

    case 'loggedIn':
      this._loggedIn = true;
      break;

    case 'loggedOut':
      this._loggedIn = false;
      break;

    case 'passwordUpdated':
      this._password = event.attributes.password;
      break;
  }
}