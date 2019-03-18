'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Actor = mongoose.model('Actor'),
    Trip = mongoose.model('Trip');


var applicationSchema = new Schema({
    moment:{
        type: Date,
        required: 'Kindly enter the moment',
        default: Date.now()
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


applicationSchema.index({ status:'text'})
applicationSchema.index({ trip:1, status:'text'})
applicationSchema.index({ explorer:1, status:'text'})
applicationSchema.index({ moment: -1})


// Check if explorer is valid
applicationSchema.path('explorer').validate(
    {
       validator: function (value){
        return new Promise(function (resolve, reject) {
            var explorer_id = value;
    
            Actor.findOne({_id:explorer_id}, function(err, result){
            if(err){
                reject(new Error());
            }
            else if(!result){
                reject(new Error(`Explorer id ${explorer_id} does not reference an existing actor`));
            }
            else if(!result.role.includes('EXPLORER')){
                reject(new Error(`Referenced actor ${explorer_id} is not an explorer`));
            }
            else{
                resolve(true)
            }
            })
    
          });
        }
     , message: function(props) { return props.reason.message; }} );
    


// Check if trip is valid
applicationSchema.path('trip').validate(
    {
       validator: function (value){
        return new Promise(function (resolve, reject) {
            var trip_id = value;
    
            Trip.findOne({_id:trip_id}, function(err, result){
            if(err){
                reject(new Error());
            }
            else if(!result){
                reject(new Error(`Trip id ${trip_id} does not reference an existing trip`));
            }
            else{
                resolve(true)
            }
            })
    
          });
        }
     , message: function(props) { return props.reason.message; }} );



module.exports = mongoose.model('Application', applicationSchema);
