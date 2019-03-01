'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Actor = mongoose.model('Actor');


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

sponsorshipSchema.index({ sponsor: 1, paid: 1 })

// Check if sponsor is valid
sponsorshipSchema.pre('validate', function (next) {
    var sponsorship = this;
    var sponsor_id = sponsorship.sponsor;
    if (sponsor_id) {
        Actor.findOne({ _id: sponsor_id }, function (err, result) {
            if (err) {
                return next(err);
            }
            if (!result) {
                sponsorship.invalidate('sponsor', `Sponsor id ${sponsorship.sponsor} does not reference an existing actor`, sponsorship.sponso);
            }
            else if (!result.role.includes('SPONSOR')) {
                sponsorship.invalidate('sponsor', `Referenced actor ${sponsorship.sponso} is not an sponsor`, sponsorship.sponso);
            }
            return next();
        });
    }
    else {
        return next();
    }

});

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
