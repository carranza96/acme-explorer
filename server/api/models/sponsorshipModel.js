'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Actor = mongoose.model('Actor');


var sponsorshipSchema = new Schema({
    banner: {
        type: Buffer,
        required:"Please add an image for your sponsorship"
    },
    landingPage: {
        type: String,
        required:"Please add an url to your landing page"
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

sponsorshipSchema.index({sponsor:1, paid:1})

// VALIDATION

  // Check if sponsor is valid

  sponsorshipSchema.path('sponsor').validate(
    {
       validator: function (value){
        return new Promise(function (resolve, reject) {
            var sponsor_id = value;
    
            Actor.findOne({_id:sponsor_id}, function(err, result){
            if(err){
                reject(new Error());
            }
            else if(!result){
                reject(new Error(`Sponsor id ${sponsor_id} does not reference an existing actor`));
            }
            else if(!result.role.includes('SPONSOR')){
                reject(new Error(`Referenced actor ${sponsor_id} is not an sponsor`));
            }
            else{
                resolve(true)
            }
            })
    
          });
        }
     , message: function(props) { return props.reason.message; }} );

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
