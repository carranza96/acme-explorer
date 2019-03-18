'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
Trip = mongoose.model('Trip')


var finderSchema = new Schema({
    explorer: {
      type: Schema.Types.ObjectId,
      unique: true,
      // required: 'Kindly enter the explorer',
      ref: 'Actor'
    },
    keyWord: {
      type: String,
      default: null
    },
    minPrice: {
      type: Number,
      default: null,
      min: 0
    },
    maxPrice: {
      type: Number,
      default: null,
    },
    minDate: {
      type: Date,
      default: null
    },
    maxDate: {
      type: Date,
      default: null,
    },
    results: [{
      type: Schema.Types.ObjectId,
      ref: 'Trip'
    }]

  
  }, { strict: false } )

finderSchema.index({explorer:1})
finderSchema.index({keyword:"text"})

// VALIDATION

// Check min date is before max date
finderSchema.path('minDate').validate( function(value){
  if(this._update){
      if (this._update.maxDate){
          return new Date(this._update.maxDate) > value;
      }
      else{
          var update_doc = this
          return new Promise(function (resolve, reject) {                
              Finder.findById(update_doc._conditions._id, function (err, finder) {
                  if (err) {
                      reject(new Error());
                  }
                  else {
                      resolve(finder.maxDate > value);
                  }
              });
      
            });
      }
  }
  else{
      if(!this.maxDate){
        console.log("hola")
        return true;
      }
      else{
        console.log("adios")
        return this.maxDate > value;
      }
  }
},'Min date must be before max date')


// Check max date is after min date
finderSchema.path('maxDate').validate( function(value){
  if(this._update){
      if (this._update.minDate){
          return new Date(this._update.minDate) < value;
      }
      else{
          var update_doc = this
          return new Promise(function (resolve, reject) {                
              Finder.findById(update_doc._conditions._id, function (err, finder) {
                  if (err) {
                      reject(new Error());
                  }
                  else {
                      resolve(finder.minDate < value);
                  }
              });
            });
      }
  }
  else{
      if(!this.minDate){
        return true
      }
      else{
        return this.minDate < value;
      }
  }
},'Min date must be before max date')



// Check min price is lower than max price
finderSchema.path('minPrice').validate( function(value){
  if(this._update){
      if (this._update.maxPrice){
          return this._update.maxPrice > value;
      }
      else{
          var update_doc = this
          return new Promise(function (resolve, reject) {                
              Finder.findById(update_doc._conditions._id, function (err, finder) {
                  if (err) {
                      reject(new Error());
                  }
                  else {
                      resolve(finder.maxPrice > value);
                  }
              });
            });
      }
  }
  else{
      if(!this.maxPrice){
        return true
      }
      else{
        return this.maxPrice > value;
      }
  }
},'Min price must be lower than max price')




// Check if explorer is valid
finderSchema.path('explorer').validate(
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


module.exports = mongoose.model('Finder', finderSchema);
