'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Trip = require('./api/models/tripModel'),


var FinderSchema = new Schema({
  keyWord:{
    type: String,
    default: null
  },
  minPrice:{
    type: Number,
    default: null,
    min:0
  },
  maxPrice:{
    type: Number,
    default: null,
    min: this.minPrice
  },
  minDate:{
    type: Date,
    default: null
  },
  maxDate:{
    type: Date,
    default: null
  },
  results:{
    type: [Trip.tripSchema]
  }


}, { strict: false } )

var ActorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name'
  },
  surname: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  email: {
    type: String,
    required: 'Kindly enter the actor email'
  },
  password: {
    type: String,
    minlength:5,
    required: 'Kindly enter the actor password'
  },
  preferredLanguage:{
    type : String,
    default : "en"
  },
  phone: {
    type: String
  },
  address:{
    type: String
  },

  role: [{
    type: String,
    required: 'Kindly enter the user role(s)',
    enum: ['EXPLORER', 'MANAGER', 'ADMINISTRATOR','SPONSOR']
  }],
  banned:{
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });


module.exports = mongoose.model('Actors', ActorSchema);