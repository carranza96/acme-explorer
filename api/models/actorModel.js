'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
// var immutablePlugin = require('mongoose-immutable-plugin');


var finderSchema = new Schema({
  keyWord: {
    type: String,
    default: null
  },
  minPrice: {
    type: Number,
    default: null,
    min: 0
  },
  maxPrice: {
    type: Number,
    default: null,
    min: this.minPrice
  },
  minDate: {
    type: Date,
    default: null
  },
  maxDate: {
    type: Date,
    default: null
  },
  results: [{
    type: Schema.Types.ObjectId,
    ref: 'Trip'
  }]

}, { strict: false } )


var actorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name',
    // immutable:true
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
  created: {
    type: Date,
    default: Date.now
  },
  finder:{
    type: finderSchema
  }
}, { strict: false });

// actorSchema.plugin(immutablePlugin)

actorSchema.pre('save', function (callback) {
  var actor = this;
  // Break out if the password hasn't changed
  if (!actor.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);

    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err);
      actor.password = hash;
      callback();
    });
  });
});

actorSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    console.log('verifying password in actorModel: ' + password);
    if (err) return cb(err);
    console.log('iMatch: ' + isMatch);
    cb(null, isMatch);
  });
};



module.exports = mongoose.model('Actor', actorSchema);
module.exports = mongoose.model('Finder', finderSchema);
