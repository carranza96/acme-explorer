'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatsSchema = new mongoose.Schema({
  avg: {
    type: Number,
    min: 0
  },

  min: {
    type: Number,
    min: 0
  },

  max: {
    type: Number,
    min: 0
  },

  std: {
    type: Number,
    min: 0
  }
}, { strict: false })

var DataWareHouseSchema = new mongoose.Schema({

  // Number of trips managed per managers
    tripsPerManagerStats: {
      type: StatsSchema
    },
  // Number of applications per trip
    avgNumApplicationsTrip: {
      type: Number,
      min: 0
    },
    minNumApplicationsTrip: {
      type: Number,
      min: 0
    },
    maxNumApplicationsTrip: {
      type: Number,
      min: 0
    },
    stdNumApplicationsTrip: {
      type: Number,
      min: 0
    },

  // Price of trips
    avgPriceTrip: {
      type: Number,
      min: 0
    },
    minPriceTrip: {
      type: Number,
      min: 0
    },
    maxPriceTrip: {
      type: Number,
      min: 0
    },
    stdPriceTrip: {
      type: Number,
      min: 0
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
