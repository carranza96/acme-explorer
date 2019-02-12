'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var applicationSchema = new Schema({
    moment:{
        type: Date,
        required: 'Kindly enter the moment',
        default: Date.now
        // TODO: Validar restricción fecha pasada
    },
    status:{
        type: String,
        required: 'Kindly enter the status',
        default: 'PENDING',
        enum: ['PENDING','REJECTED', 'DUE','ACCEPTED','CANCELLED'],
    },
    comments:{
        type: [String]
    },
    rejectReason:{
        type: String
    },
    paid:{
        type:Boolean,
        default:false
    },
    explorer:{
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: 'Kindly enter the explorer id'
    },
},  { strict: false })




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
        required: 'Kindly enter the ticker',
        match: [/^([0-9]){2}([0-1]){1}([0-9]){1}([0-3]){1}([0-9]){1}-([A-Z]){4}$/, 'Please fill a valid ticker matching the pattern YYMMDD-XXXX']
        // Validate pattern "YYMMDD-XXXX"
    },
    title:{
        type: String,
        required: 'Kindly enter the title',
    },
    description:{
        type: String,
        required: 'Kindly enter the description',
    },
    price:{
        type: Number,
        required: 'Kindly enter the description',
        min: 0
    },
    requirements: {
        type: [String],
        required: 'Kindly enter the requirements',
    },
    startDate: {
        type: Date,
        required: 'Kindly enter the start date',
    },
    endDate: {
        type: Date,
        required: 'Kindly enter the end date',
        // Validate after startDate
    },
    pictures: {
        data: [Buffer],
        contentType: String
    },
    reasonCancellation: {
        data: String
    },
    stages: [stageSchema],
    applications:{
        type: [applicationSchema]
    },
    sponsorships: [sponsorshipSchema]
}, { strict: false });

// Execute before each trip.save() call
TripSchema.pre('save', function(callback) {
  var new_trip = this;
  var date = new Date;
  var day=dateFormat(new Date(), "yymmdd");

  var generated_ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
  new_trip.ticker = generated_ticker;
  callback();
});

module.exports = mongoose.model('Trips', tripSchema);
