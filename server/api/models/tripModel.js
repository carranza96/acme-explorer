'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Actor = mongoose.model('Actor'),
    Sponsorship = mongoose.model('Sponsorship');

const generate = require('nanoid/generate');
const dateformat = require('dateformat');

var stageSchema = new Schema({
    title: {
        type: String,
        required: 'Kindly enter the title'
    },
    description: {
        type: String,
        required: 'Kindly enter the description'
    },
    price: {
        type: Number,
        required: 'Kindly enter the description',
        min: 0
    }
}, { strict: false })



var tripSchema = new Schema({
    ticker: {
        type: String,
        unique: true,
        match: [/^([0-9]){2}([0-1]){1}([0-9]){1}([0-3]){1}([0-9]){1}-([A-Z]){4}$/, 'Please fill a valid ticker matching the pattern YYMMDD-XXXX']
    },
    title: {
        type: String,
        required: 'Kindly enter the title',
    },
    description: {
        type: String,
        required: 'Kindly enter the description',
    },
    price: {
        type: Number,
        min: 0
    },
    requirements: [{
        type: String,
        required: 'Kindly enter the requirements',
    }],
    startDate: {
        type: Date,
        required: 'Kindly enter the start date',
    },
    endDate: {
        type: Date,
        required: 'Kindly enter the end date',
    },
    pictures: [{
        data: Buffer,
        contentType: String
    }],
    published: {
        type: Boolean,
        default: false
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    reasonCancellation: {
        type: String
    },
    stages: [stageSchema],
    sponsorships: [{
        type: Schema.Types.ObjectId,
        ref: 'Sponsorship',
    }],
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: 'Enter the manager of the trip'
    }
}, { strict: false });

tripSchema.index({ ticker: 'text', title: 'text', description: 'text' });
tripSchema.index({startDate:-1, endDate:-1});
tripSchema.index({ price: 1 });
tripSchema.index({manager: 1});


// Validation

tripSchema.path('endDate').validate(async function(value){
    if(this._update){
        if (this._update.startDate){
            return new Date(this._update.startDate) < value;
        }
        else{
            var condition;
            await Trip.findById(this._conditions._id, function (err, trip) {
                if (err) {
                  throw new Error("Trip not found");
                }
                else {
                    condition = trip.startDate < value;
                }
            });
            return condition;
        }
    }

    else{
        return this.startDate < value;
    }
},'End date must be after start date')



tripSchema.path('startDate').validate( function(value){
    if(this._update){
        if (this._update.endDate){
            return new Date(this._update.endDate) > value;
        }
        else{
            var update_doc = this
            return new Promise(function (resolve, reject) {                
                Trip.findById(update_doc._conditions._id, function (err, trip) {
                    if (err) {
                        reject(new Error());
                    }
                    else {
                        resolve(trip.endDate > value);
                    }
                });
        
              });
        }
    }
    else{
        return this.endDate > value;
    }
},'Start date must be before end date')




// Check if manager is valid
tripSchema.path('manager').validate(
{
   validator: function (value){
    return new Promise(function (resolve, reject) {
        var manager_id = value;

        Actor.findOne({_id:manager_id}, function(err, result){
        if(err){
            reject(new Error());
        }
        else if(!result){
            reject(new Error(`Manager id ${manager_id} does not reference an existing actor`));
        }
        else if(!result.role.includes('MANAGER')){
            reject(new Error(`Referenced actor ${manager_id} is not an explorer`));
        }
        else{
            resolve(true)
        }
        })

      });
    }
 , message: function(props) { return props.reason.message; }} );





// Check if sponsorships are valid
tripSchema.path('sponsorships').validate(
    {
       validator: function (value){

        return new Promise(function (resolve, reject) {

            var sponsorship_ids = value;

            var promises = sponsorship_ids.map( function(sponsorship_id){
                return new Promise(function (resolve,reject){
                    Sponsorship.findOne({_id:sponsorship_id}, function(err, result){
                        if(err){
                            reject(new Error());
                        }
                        else if(!result){
                            reject(new Error(`Sponsorship id ${sponsorship_id} does not reference an existing sponsorship`));
                        }
                        else{
                            resolve(true)
                        }
                    })
                })
            })

            Promise.all(promises).then(res => resolve(res)).catch(e => reject(e))
            })
        }
     , message: function(props) { return props.reason.message; }} );


// Check if manager is valid
// tripSchema.pre('validate', function(next) {
//     var trip = this;
//     var manager_id = trip.manager;
//     if (manager_id) {
//         Actor.findOne({_id:manager_id}, function(err, result){
//             if(err){
//                 return next(err);
//             }
//             if(!result){
//                 trip.invalidate('manager', `Manager id ${trip.manager} does not reference an existing actor`, trip.manager);
//             }
//             else if(!result.role.includes('MANAGER')){
//                 trip.invalidate('manager', `Referenced actor ${trip.manager} is not an explorer`, trip.manager);
//             }
//             return next();
//         });
//     }
//     else{
//         return next();
//     }
//   });


// Execute before each trip.save() call
tripSchema.pre('save', function (callback) {
    var new_trip = this;
    var day = dateformat(new Date(), "yymmdd");
    var generated_ticker = [day, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
    new_trip.ticker = generated_ticker;
    callback();
});

// Calculate price summing up individual stages
tripSchema.pre('save', function(callback) {
    var stages_price = this.stages.map((stage) => stage.price);
    this.price = stages_price.reduce((a, b) => a + b, 0);
    callback();
});

tripSchema.pre('findOneAndUpdate', function (next) {
    if(!this._update.stages){
      return next();
    }
    var stages_price = this._update.stages.map((stage) => stage.price);
    var totalPrice = stages_price.reduce((a, b) => a + b, 0);
    console.log(totalPrice)
    this.update({},{ $set:{price: totalPrice}});
    next();
  });

tripSchema.pre('findOneAndUpdate', function (next) {
    if(this._update.ticker){
      delete this._update.ticker;
    }
    next();
  });


module.exports = {
    Trip : mongoose.model('Trip', tripSchema),
    Stage : mongoose.model('Stage', stageSchema)
}