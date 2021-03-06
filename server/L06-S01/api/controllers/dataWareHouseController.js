
var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Orders =  mongoose.model('Orders');

exports.list_all_indicators = function(req, res) {
  console.log('Requesting indicators');
  
  DataWareHouse.find().sort("-computationMoment").exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

exports.last_indicator = function(req, res) {
  
  DataWareHouse.find().sort("-computationMoment").limit(1).exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '0 0 * * * *';  //El que se usará por defecto
var computeDataWareHouseJob;

exports.rebuildPeriod = function(req, res) {
  console.log('Updating rebuild period. Request: period:'+req.query.rebuildPeriod);
  rebuildPeriod = req.query.rebuildPeriod;
  computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
  computeDataWareHouseJob.start();

  res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob(){
      computeDataWareHouseJob = new CronJob(rebuildPeriod,  function() {
      
      var new_dataWareHouse = new DataWareHouse();
      console.log('Cron job submitted. Rebuild period: '+rebuildPeriod);
      async.parallel([
        computeTopCancellers,
        computeTopNotCancellers,
        computeBottomNotCancellers,
        computeTopClerks,
        computeBottomClerks,
        computeRatioCancelledOrders
      ], function (err, results) {
        if (err){
          console.log("Error computing datawarehouse: "+err);
        }
        else{
          //console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
          new_dataWareHouse.topCancellers = results[0];
          new_dataWareHouse.topNotCancellers = results[1];
          new_dataWareHouse.bottomNotCancellers = results[2];
          new_dataWareHouse.topClerks = results[3];
          new_dataWareHouse.bottomClerks = results[4];
          new_dataWareHouse.ratioCancelledOrders = results[5];
          new_dataWareHouse.rebuildPeriod = rebuildPeriod;
    
          new_dataWareHouse.save(function(err, datawarehouse) {
            if (err){
              console.log("Error saving datawarehouse: "+err);
            }
            else{
              console.log("new DataWareHouse succesfully saved. Date: "+new Date());
            }
          });
        }
      });
    }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

function computeTopCancellers (callback) {
   Orders.aggregate([
    {$match:{ cancelationMoment: { $exists: true } }},
    {$facet:{
        preComputation: [
        {$group : {_id:"$consumer", ordersCanceled:{$sum:1}}},
        {$group: {_id:null, nCanceladores: {$sum: 1}}},
        {$project: {_id:0,limitTopPercentage: { $ceil: {$multiply: [ "$nCanceladores", 0.1 ]}}}}
        ],
        canceladores: [{$project:{_id:0,consumer:1}},{$group : {_id:"$consumer", ordersCanceled:{$sum:1}}},  { $sort:{"ordersCanceled":-1}}]
        }
    },
    { $project: { topCanceladores: { $slice: [ "$canceladores", { $arrayElemAt: [ "$preComputation.limitTopPercentage", 0 ] } ] }}}
    ], function(err, res){
        callback(err, res[0].topCanceladores)
    }); 
};

function computeTopNotCancellers(callback) {
  Orders.aggregate([
    {$match:{ cancelationMoment: { $exists: false } }},
    {$facet:{
        preComputation: [
        {$group : {_id:"$consumer", ordersNotCanceled:{$sum:1}}},
        {$group: {_id:null, nNoCanceladores: {$sum: 1}}},
        {$project: {_id:0,limitTopPercentage: { $ceil: {$multiply: [ "$nNoCanceladores", 0.1 ]}}}}
        ],
        noCanceladores: [{$project:{_id:0,consumer:1}},{$group : {_id:"$consumer", ordersNotCanceled:{$sum:1}}},  { $sort:{"ordersNotCanceled":-1}}]
        }
    },
    { $project: { topNoCanceladores: { $slice: [ "$noCanceladores", { $arrayElemAt: [ "$preComputation.limitTopPercentage", 0 ] } ] }}}
    ], function(err, res){
      callback(err, res[0].topNoCanceladores)
  });
};

function computeBottomNotCancellers(callback) {
  Orders.aggregate([
    {$match:{ cancelationMoment: { $exists: false } }},
    {$facet:{
        preComputation: [
        {$group : {_id:"$consumer", ordersNotCanceled:{$sum:1}}},
        {$group: {_id:null, nNoCanceladores: {$sum: 1}}},
        {$project: {_id:0,limitTopPercentage: { $ceil: {$multiply: [ "$nNoCanceladores", 0.1 ]}}}}
        ],
        noCanceladores: [{$project:{_id:0,consumer:1}},{$group : {_id:"$consumer", ordersNotCanceled:{$sum:1}}},  { $sort:{"ordersNotCanceled":1}}]
        }
    },
    { $project: { bottomNoCanceladores: { $slice: [ "$noCanceladores", { $arrayElemAt: [ "$preComputation.limitTopPercentage", 0 ] } ] }}}
    ], function(err, res){
      callback(err, res[0].bottomNoCanceladores)
  });
};

function computeTopClerks (callback) {
  Orders.aggregate([
    {$match:{ deliveryMoment: { $exists: true } }},
    {$facet:{
        preComputation: [
        {$group : {_id:"$clerk", ordersDelivered:{$sum:1}}},
        {$group: {_id:null, nDeliverers: {$sum: 1}}},
        {$project: {_id:0,limitTopPercentage: { $ceil: {$multiply: [ "$nDeliverers", 0.1 ]}}}}
        ],
        deliverers: [{$project:{_id:0,clerk:1}},{$group : {_id:"$clerk", ordersDelivered:{$sum:1}}},  { $sort:{"ordersDelivered":-1}}]
        }
    },
    { $project: { topDeliverers: { $slice: [ "$deliverers", { $arrayElemAt: [ "$preComputation.limitTopPercentage", 0 ] } ] }}}
    ], function(err, res){
      callback(err, res[0].topDeliverers)
  });
};

function computeBottomClerks (callback) {
  Orders.aggregate([
    {$match:{ deliveryMoment: { $exists: true } }},
    {$facet:{
        preComputation: [
        {$group : {_id:"$clerk", ordersDelivered:{$sum:1}}},
        {$group: {_id:null, nDeliverers: {$sum: 1}}},
        {$project: {_id:0,limitTopPercentage: { $ceil: {$multiply: [ "$nDeliverers", 0.1 ]}}}}
        ],
        deliverers: [{$project:{_id:0,clerk:1}},{$group : {_id:"$clerk", ordersDelivered:{$sum:1}}},  { $sort:{"ordersDelivered":1}}]
        }
    },
    { $project: { bottomDeliverers: { $slice: [ "$deliverers", { $arrayElemAt: [ "$preComputation.limitTopPercentage", 0 ] } ] }}}
    ], function(err, res){
      callback(err, res[0].bottomDeliverers)
  });
};

function computeRatioCancelledOrders (callback) {
  Orders.aggregate([
    {$project : { 
    "placementMonth" : { "$month" : "$placementMoment" }, 
    "placementYear" : {"$year" : "$placementMoment" },
    "cancelationMoment": 1 }},
    {$match:{ "placementMonth" : new Date().getMonth()+1,
                             "placementYear" : new Date().getFullYear() 
                             }},
            {$facet:{
        totalOrdersCurrentMonth: [{$group : {_id:null, totalOrders:{$sum:1}}}],
        totalCancelledOrdersCurrentMonth: [
        {$match:{"cancelationMoment": { $exists: true }}},
        {$group : {_id:null, totalOrders:{$sum:1}}}]
        }
            },
    
            {$project: {_id:0,ratioOrdersCancelledCurrentMont: { $divide: [{$arrayElemAt: [ "$totalCancelledOrdersCurrentMonth.totalOrders", 0 ]}, {$arrayElemAt: [ "$totalOrdersCurrentMonth.totalOrders", 0 ]} ]}}} 
    ], function(err, res){
      callback(err, res[0].ratioOrdersCancelledCurrentMont)
  });
};