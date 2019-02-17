'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const generate = require('nanoid/generate');
const dateformat = require('dateformat');

var stageSchema = new Schema({
    title:{
        type: String,
        required: 'Kindly enter the title'
    },
    description:{
        type: String,
        required: 'Kindly enter the description'
    },
    price: {
        type: Number,
        required: 'Kindly enter the description',
        min: 0
    }
}, { strict: false })

var sponsorshipSchema = new Schema({
    banner:{
        type: Buffer
    },
    landingPage:{
        type: String
    },
    paid:{
        type: Boolean,
        default: false
    },
    sponsor:{
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: 'Kindly enter the sponsor id'
    }
}, { strict: false })


var tripSchema = new Schema({
    ticker:{
        type: String,
        unique: true,
        match: [/^([0-9]){2}([0-1]){1}([0-9]){1}([0-3]){1}([0-9]){1}-([A-Z]){4}$/, 'Please fill a valid ticker matching the pattern YYMMDD-XXXX']
    },
    title:{
        type: String,
        required: 'Kindly enter the title',
    },
    description:{
        type: String,
        required: 'Kindly enter the description',
    },
    totalPrice:{
        type: Number,
        min: 0
    },
    requirements: [{
        type: String,
        required: 'Kindly enter the requirements',
    }],
    startDate: {
        type: Date,
        required: 'Kindly enter the start date',
    },
    endDate: {
        type: Date,
        required: 'Kindly enter the end date',
        validate: {
            validator: function(value) {
                return this.startDate < value;
            },
            message: 'End date must be after start date'
          }
    },
    pictures: [{
        data: Buffer,
        contentType: String
    }],
    published:{
        type: Boolean,
        default: false
    },
    cancelled:{
        type:Boolean,
        default:false
    },
    reasonCancellation: {
        type: String
    },
    stages:[stageSchema],
    sponsorships:[{
        type: Schema.Types.ObjectId,
        ref: 'Sponsorship',
    }],
    manager:{
        type: Schema.Types.ObjectId,
        ref:'Actor'
    }
}, { strict: false });

tripSchema.index({ticker: 'text',title:'text',description:'text'});



// Execute before each trip.save() call
// Generate ticker
tripSchema.pre('save', function(callback) {
  var new_trip = this;
  var day = dateformat(new Date(), "yymmdd");
  var generated_ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
  new_trip.ticker = generated_ticker;
  callback();
});

// Calculate price summing up individual stages
tripSchema.pre('save', function(callback) {
    var stages_price = this.stages.map((stage) => stage.price);
    this.totalPrice = stages_price.reduce((a, b) => a + b, 0);
    callback();
  });


module.exports = mongoose.model('Trip', tripSchema);
