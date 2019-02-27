'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DataWareHouseSchema = new mongoose.Schema({

  // Number of trips managed per managers
    tripsPerManagerStats: {
      avg:Number, min:Number, max:Number, std:Number
    },
  // Price of trips
    tripPriceStats:{
      avg:Number, min:Number, max:Number, std:Number
    },
  // Number of applications per trip
    applicationsPerTripStats:{
      avg:Number, min:Number, max:Number, std:Number
    },
    // Ratio of applications grouped by status
    // ratioApplicationsStatus: [{
    //   type: Schema.Types.ObjectId
    // }],


    computationMoment: {
        type: Date,
        default: Date.now
      },
      rebuildPeriod: {
        type: String
      }


}, { strict: false });



DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
