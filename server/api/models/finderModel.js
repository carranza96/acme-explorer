'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var finderSchema = new Schema({
    explorer: {
      type: Schema.Types.ObjectId,
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
      min: this.minPrice
    },
    minDate: {
      type: Date,
      default: null
    },
    maxDate: {
      type: Date,
      default: null
    },
    results: [{
      type: Schema.Types.ObjectId,
      ref: 'Trip'
    }]
  
  }, { strict: false } )

finderSchema.index({explorer:1})
finderSchema.index({keyword:"text"})


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
