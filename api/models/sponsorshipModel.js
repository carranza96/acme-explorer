'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sponsorshipSchema = new Schema({
    banner: {
        type: Buffer,
        //required:"Please add an image for your sponsorship"
    },
    landingPage: {
        type: String,
        //required:"Please add an url to your landing page"
    },
    paid: {
        type: Boolean,
        default: false
    },
    sponsor: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: 'Kindly enter the sponsor id'
    }
}, { strict: false })

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
