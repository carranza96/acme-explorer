'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const generate = require('nanoid/generate');
const dateFormat = require('dateformat');

var OrderedItemSchema = new Schema({
  sku: {
   type: String,
   validate: {
    validator: function(v) {
        return /^\w{6}$/.test(v);
    },
    message: 'sku is not valid!, Pattern("^\w{6}$")'
    }
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
   type: String,
   unique: true,
   //This validation does not run after middleware pre-save
   validate: {
      validator: function(v) {
          return /\d{6}-\w{6}/.test(v);
      },
      message: 'ticker is not valid!, Pattern("\d(6)-\w(6)")'
    }
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


// Execute before each item.save() call
OrderSchema.pre('save', function(callback) {
  var new_order = this;
  var date = new Date;
  var day=dateFormat(new Date(), "yymmdd");

  var generated_ticker = [day, generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)].join('-')
  new_order.ticker = generated_ticker;
  callback();
});
module.exports = mongoose.model('Orders', OrderSchema);
