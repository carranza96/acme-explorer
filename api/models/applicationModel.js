'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var applicationSchema = new Schema({
    moment:{
        type: Date,
        required: 'Kindly enter the moment',
        default: Date.now
    },
    status:{
        type: String,
        required: 'Kindly enter the status',
        default: 'PENDING',
        enum: ['PENDING','REJECTED', 'DUE','ACCEPTED','CANCELLED'],
    },
    comments: [String],
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
    trip:{
        type: Schema.Types.ObjectId,
        ref: 'Trip',
        required: 'Kindly enter the trip id' 
    }
},  { strict: false })

module.exports = mongoose.model('Applications', applicationSchema);
