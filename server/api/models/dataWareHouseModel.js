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
    ratioApplicationsStatus:{
      PENDING:{
        type:Number,
        default:0
      },
      REJECTED:{
        type:Number,
        default:0
      },
      DUE:{
        type:Number,
        default:0
      },
      ACCEPTED:{
        type:Number,
        default:0
      },
      CANCELLED:{
        type:Number,
        default:0
      },
    },

    // Average price range that explores indicate in their finders
    finderPriceStats:{
      minPriceAvg:Number,
      maxPriceAvg:Number
    },
    // Top 10 keywords in finders
    finderKeyWordsStats:[String],


    computationMoment: {
        type: Date,
        default: Date.now()
      },
      rebuildPeriod: {
        type: String
      }


}, { strict: false });

// So that we can query the last saved element fast
DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
