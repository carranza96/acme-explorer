'use strict';
var mongoose = require('mongoose');


var Schema = mongoose.Schema,
    Actor = mongoose.model('Actor'),
    Trip = mongoose.model('Trip');

var applicationSchema = new Schema({
    moment:{
        type: Date,
        required: 'Kindly enter the moment',
        default: Date.now
    },
    status:{
        type: String,
        required: 'Kindly enter the status',
        default: 'PENDING',
        enum: ['PENDING','REJECTED', 'DUE','ACCEPTED','CANCELLED'],
    },
    comments: [String],
    rejectReason:{
        type: String
    },
    paid:{
        type:Boolean,
        default:false
    },
    explorer:{
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: 'Kindly enter the explorer id'
    },
    trip:{
        type: Schema.Types.ObjectId,
        ref: 'Trip',
        required: 'Kindly enter the trip id' 
    }
},  { strict: false })


applicationSchema.index({explorer:1, moment:1})
applicationSchema.index({trip:1, status:'text'})
applicationSchema.index({moment: 1})

// Check if explorer is valid
applicationSchema.pre('validate', function(next) {
    var application = this;
    var explorer_id = application.explorer;
    if (explorer_id) {
        Actor.findOne({_id:explorer_id}, function(err, result){
            if(err){
                return next(err);
            }
            if(!result){
                application.invalidate('explorer', `Explorer id ${application.explorer} does not reference an existing actor`, application.explorer);
            }
            else if(!result.role.includes('EXPLORER')){
                application.invalidate('explorer', `Referenced actor ${application.explorer} is not an explorer`, application.explorer);
            }
            return next();
        });
    }
    else{
        return next();
    }
    
  });


  // Check if trip is valid
  applicationSchema.pre('validate', function(next) {
    var application = this;
    var trip_id = application.trip;
    if (trip_id){
        Trip.findOne({_id:trip_id}, function(err, result){
            if(err){
                return next(err);
            }
            if(!result){
                application.invalidate('trip', `Trip id ${application.trip} does not reference an existing trip`, application.trip);
            }
            return next();
        });
    }
    else{
        return next();
    }
    
  });




module.exports = mongoose.model('Application', applicationSchema);
