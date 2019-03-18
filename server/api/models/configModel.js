'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configSchema = new Schema({
    finderResultCacheTime: {
        type: Number,
        min: 60,
        max: 24 * 60,
        default: 60
    },
    finderResultNumber: {
        type: Number,
        default: 10,
        max: 100
    },
    sponsorshipFlatRate: {
        type: Number,
        min: 0
    }

}, { strict: false })


// VALIDATION


configSchema.methods.toJSON = function() {
 var obj = this.toObject();
 delete obj._id;
 delete obj.__v
 return obj;
}

module.exports = mongoose.model('Config', configSchema);
