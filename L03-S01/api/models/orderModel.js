'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderedItemSchema = new Schema({
  sku: {
   type: String
  },
  name: {
    type: String,
    required: 'Item name required'
  },
  quantity: {
    type: Number,
    min: 1
  },
  price: {
    type: Number,
    min: 0
  },
   served: {
    type: Boolean,
    default: false
  }
}, { strict: false });

var OrderSchema = new mongoose.Schema({
  ticker: {
   type: String
  },
  consumerName:{
    type: String,
    required: 'Consumer name required'
  },
  placementMoment: {
    type: Date,
    default: Date.now
  },
  deliveryMoment: {
    type: Date
  },
  cancelationMoment: {
    type: Date
  },
  deliveryAddress:{
    type: String,
    required: 'Delivery address required'
  },
  comments: [String],
  total:{
    type: Number,
    min: 0
  },
  consumer: {
    type: Schema.Types.ObjectId,
    required: 'consumer id required'
  },
  clerk: {
    type: Schema.Types.ObjectId
  },
  orderedItems: [OrderedItemSchema]
}, { strict: false });

module.exports = mongoose.model('Orders', OrderSchema);
