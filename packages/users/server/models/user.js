'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

/**
 * Validations
 */
var validatePresenceOf = function(value) {
  // If you are authenticating by any of the oauth strategies, don't validate.
  return (this.provider && this.provider !== 'local') || (value && value.length);
};

var validateUniqueEmail = function(value, callback) {
  var User = mongoose.model('User');
  User.find({
    $and: [{
      email: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, user) {
    callback(err || user.length === 0);
  });
};

var validateUserRole = function(value) {
  var possibleRoles = ['authenticated', 'Member', 'Event Manager', 'Account Manager', 'Standard Employee', 'Accountant'],
    valid = false, i;
  if ( value !== undefined && value !== null && value instanceof Array) {
      console.log('Validating user role ' + value + ' for ' + this._id);
    for (i = 0; i < value.length; i++) {
      if (possibleRoles.indexOf(value[i]) !== -1) {
        valid = true;
      }
      else {
        return false;
      }
    }
  } else if (possibleRoles.indexOf(value) !== -1) {
      valid = true;
  } else {valid = false;}

  return valid;
};
/**
 * User Schema
 */

var UserSchema = new Schema({
   /* city: { type: String, required: true },
    deletionFlag: { type: String, required: false },
    emergencyContactName: {  type: String, required: false },
    personalEmail: { type: String, required: true },
    primaryEmergencyPhoneNumber: { type: String, required: false },
    primaryPhoneNumber: {  type: String,  required: true },
    secondaryEmergencyPhoneNumber: {  type: String, required: true },
    secondaryPhoneNumber: { type: String, required: true },
    state: { type: String,  required: true },
    userCreatedDate: { type: String, default: Date.now },
    streetAddress: { type: String, required: true },
    userFirstName: { type: String, required: true },

    zip: { type: String, required: true }, */
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    validate: [validateUniqueEmail, 'E-mail address is already in-use']
  },
  roles: {
    type: Array,
    default: ['authenticated'],  // authenticated, accountManager, owner, eventManager, admin ..
    validate: [validateUserRole, 'Role does not exist']
  },
  hashed_password: {
    type: String,
    validate: [validatePresenceOf, 'Password cannot be blank']
  },
  provider: {
    type: String,
    default: 'local'
  },
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  linkedin: {},
  
  
  //*******************************************
  //  GTD Account fields
  //  Note!: The requirements are all being set to false for testing purposes. Add neccessary requirements back in later!
  //*******************************************
  //Birthday wasn't in original schema
  birthday: { type: Date, required: false },
  city: { type: String, required: false },
  deletionFlag: { type: String, required: false },
  drivingLevel: { type: String, required: false },
  emergencyContactName: {  type: String, required: false },
  primaryEmergencyPhoneNumber: { type: String, required: false },
  primaryPhoneNumber: {  type: String, required: false },
  secondaryEmergencyPhoneNumber: {  type: String, required: false },
  secondaryPhoneNumber: { type: String, required: false },
  state: { type: String,  required: false },
  userCreatedDate: { type: Date, default: Date.now },
  streetAddress: { type: String, required: false },
  userFirstName: { type: String, required: false },
  userLastName: { type: String, required: false },
  zip: { type: String, required: false }
  //*******************************************
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.hashPassword(password);
}).get(function() {
  return this._password;
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
    return next(new Error('Invalid password'));
  next();
});

/**
 * Methods
 */
UserSchema.methods = {

  /**
   * HasRole - check if the user has required role
   *
   * @param {String} role
   * @return {Boolean}
   * @api public
   */
  hasRole: function(role) {
    var roles = this.roles;
    console.log(roles);
    return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
  },

  /**
   * IsAdmin - check if the user is an administrator
   *
   * @return {Boolean}
   * @api public
   */
  isAdmin: function() {
    return this.roles.indexOf('admin') !== -1;
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Hash password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  hashPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },
  
  //************************************
  // GTD Methods
  //************************************
  
  isEventManager: function()  {
    return this.roles.indexOf('Event Manager') !== -1;
  },
  
  isAccountant: function()  {
    return this.roles.indexOf('Accountant') !== -1;
  },
  
  isEmployee: function()  {
    return this.roles.indexOf('Standard Employee') !== -1;
  },

  isMember: function()  {
    return this.roles.indexOf('Member') !== -1;
  },

  isAccountManager: function()  {
    return this.roles.indexOf('Account Manager') !== -1;
  },

  isThisUser: function(id)  {
    return this._id === id;
  }

};

mongoose.model('User', UserSchema);
