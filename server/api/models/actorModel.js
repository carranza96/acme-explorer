'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

// Defining actor schema and validation
var actorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name',
  },
  surname: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  email: {
    type: String,
    required: 'Kindly enter the actor email',
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    minlength: 5,
    required: 'Kindly enter the actor password'
  },
  preferredLanguage: {
    type: String,
    default: "en"
  },
  phone: {
    type: String,
  },
  address: {
    type: String
  },
  role: [{
    type: String,
    required: 'Kindly enter the user role(s)',
    enum: ['EXPLORER', 'MANAGER', 'ADMINISTRATOR', 'SPONSOR']
  }],
  banned: {
    type: Boolean,
    default: false
  },
  customToken: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  },
}, { strict: false });

/**The strict option makes it possible to ensure that values added
 *  to our model instance that were not specified in our schema do
 *  not get saved to the db. */

// Added an index on the role text field
actorSchema.index({ role: 'text' })

actorSchema.pre('save', function (callback) {
  var actor = this;
  // Break out if the password hasn't changed
  if (!actor.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);
    // hash new password
    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err);
      actor.password = hash;
      callback();
    });
  });
});

actorSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    console.log('verifying password in actorModel: ' + password);
    if (err) return cb(err);
    console.log('isMatch: ' + isMatch);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('Actor', actorSchema);