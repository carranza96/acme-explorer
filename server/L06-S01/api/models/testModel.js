'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TestSchema = new Schema({
  id: {
    type: String
  },
  key: {
    type: String
  },
  value: { rev: String }
}, { strict: false });

module.exports = mongoose.model('Test', TestSchema);
