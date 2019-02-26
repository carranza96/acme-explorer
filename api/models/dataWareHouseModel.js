'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataWareHouseSchema = new mongoose.Schema({
    
    
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

