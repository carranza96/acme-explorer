'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var finderSchema = new Schema({
  keyWord: {
    type: String,
    default: null
  },
  minPrice: {
    type: Number,
    default: null,
    min: 0
  },
  maxPrice: {
    type: Number,
    default: null,
    min: this.minPrice
  },
  minDate: {
    type: Date,
    default: null
  },
  maxDate: {
    type: Date,
    default: null
  },
  results: [{
    type: Schema.Types.ObjectId,
    ref: 'Trip'
  }]

}, { strict: false })

finderSchema.index({ keyword: "text" })
module.exports = mongoose.model('Finder', finderSchema);
