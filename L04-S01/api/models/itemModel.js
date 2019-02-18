'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const generate = require('nanoid/generate');

var CategorySchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the Category'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the Category'
  },
  picture: {
    data: Buffer, contentType: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

var CommentSchema = new Schema({
  title: {
    type: String,
    required: 'Kindly enter the title of the comment'
  },
  author:{
    type: String
  },
  commentText: {
    type: String,
    required: 'Kindly enter your comments'
  },
  stars: {
    type: Number,
    required: 'Kindly enter the stars',
    min: 0, max: 5
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

var ItemSchema = new Schema({
  sku: {
    type: String,
    unique: true,
    //This validation is not executed after the middleware pre-save
    validate: {
      validator: function(v) {
          return /^\w{6}$/.test(v);
      },
      message: 'sku is not valid!, Pattern("^\w{6}$")'
    }
  },
  deleted: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: 'Kindly enter the item name'
  },
  description: {
    type: String,
    required: 'Kindly enter the description'
  },
  price: {
    type: Number,
    required: 'Kindly enter the item price',
    min: 0
  },
  picture: {
    data: Buffer, contentType: String
  },
  averageStars: {
    type: Number,
    min: 0, max: 5
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  comments: [CommentSchema],
  created: {
    type: Date,
    default: Date.now
  }
},  { strict: false });

// Execute before each item.save() call
ItemSchema.pre('save', function(callback) {
  var new_item = this;
  new_item.sku = generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);
  callback();
});
module.exports = mongoose.model('Items', ItemSchema);
module.exports = mongoose.model('Categories', CategorySchema);
