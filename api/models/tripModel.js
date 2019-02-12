'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



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
    pictures: [{
        data: Buffer,
        contentType: String
    }],
    reasonCancellation: {
        data: String
    },
    stages:[{
        type: Schema.Types.ObjectId,
        ref: 'Stage',
    }],
    sponsorships:[{
        type: Schema.Types.ObjectId,
        ref: 'Sponsorship',
    }]
}, { strict: false });



module.exports = mongoose.model('Trips', tripSchema);
