'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Trip = require('./api/models/tripModel'),
var Actor = require('./api/models/actorModel'),


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
        type: Actor
    },
    trip:{
        type: Trip
    }
},  { strict: false })