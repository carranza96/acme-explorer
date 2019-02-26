'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataWareHouseSchema = new mongoose.Schema({

});



DataWareHouseSchema.index({ computationMoment: -1 });
