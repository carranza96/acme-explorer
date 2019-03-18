
var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trip =  mongoose.model('Trip'),
  Application = mongoose.model('Application'),
  Finder = mongoose.model('Finder');


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

  exports.delete_all_indicators = function(req, res) {
      DataWareHouse.deleteMany({}, function(err, actor) {
      if (err){
          res.send(err);
      }
      else{
          res.json({ message: 'All indicators in DataWareHouse successfully deleted' });
      }
  });
  };

  var CronJob = require('cron').CronJob;
  var CronTime = require('cron').CronTime;

  //'0 0 * * * *' una hora
  //'*/30 * * * * *' cada 30 segundos
  //'*/10 * * * * *' cada 10 segundos
  //'* * * * * *' cada segundo
  var rebuildPeriod = '*/5 * * * *';  //El que se usará por defecto
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
      computeTripsPerManagerStats,
      computeTripPriceStats,
      computeApplicationsPerTripStats,
      computeRatioApplicationsStatus,
      computeFinderPriceStats,
      computeFinderKeyWordsStats

    ], function (err, results) {
      if (err){
        console.log("Error computing datawarehouse: "+err);
      }
      else{
        console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
        new_dataWareHouse.tripsPerManagerStats = results[0];
        new_dataWareHouse.tripPriceStats = results[1];
        new_dataWareHouse.applicationsPerTripStats = results[2];
        new_dataWareHouse.ratioApplicationsStatus = results[3];
        new_dataWareHouse.finderPriceStats = results[4];
        new_dataWareHouse.finderKeyWordsStats = results[5];


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



function computeTripsPerManagerStats (callback) {
  Trip.aggregate([
    {$group: {	_id: "$manager",
	    		numTrips: {$sum: 1}
	    	}
	},
	{$group: {_id:null,
	    avg: {$avg: "$numTrips"},
	    max: {$max: "$numTrips"},
	    min: {$min: "$numTrips"},
	    std: {$stdDevPop: "$numTrips"}
	    }
	},
	{$project: {_id:0}}
  ], function(err, res){
      callback(err, res[0])
  });
};


function computeTripPriceStats (callback) {
  Trip.aggregate([
    {$group: {_id:null,
	    avg: {$avg: "$price"},
	    max: {$max: "$price"},
	    min: {$min: "$price"},
	    std: {$stdDevPop: "$price"}
	    }
	},
	{$project: {_id:0}}
  ], function(err, res){
      callback(err, res[0])
  });
};


function computeRatioApplicationsStatus (callback) {
  Application.aggregate([
    {$facet:{
	    applications:[ {$group: {_id:null, numTotalApplications: {$sum:1} } } ],
	    applicationsPerStatus: [{$group: {_id: "$status", numApplications: {$sum: 1}}}]
	    }
	  },
	{$project:{_id:0,
		ratio: {"$arrayToObject": {
            "$map": {
              "input": "$applicationsPerStatus",
              "as": "status",
              "in": {
                "k": "$$status._id",
                "v": {$divide: ["$$status.numApplications", {$arrayElemAt: ["$applications.numTotalApplications",0] }]  }
              }
            }
          }
      }
    }
	}], function(err, res){
    callback(err, res[0].ratio)
  });
};



function computeApplicationsPerTripStats (callback) {
  Application.aggregate([
    {$group: {	_id: "$trip",
	    		numApplications: {$sum: 1}
	    	}
	},
	{$group: {_id:null,
	    avg: {$avg: "$numApplications"},
	    max: {$max: "$numApplications"},
	    min: {$min: "$numApplications"},
	    std: {$stdDevPop: "$numApplications"}
	    }
	},
	{$project: {_id:0}}
    ], function(err, res){
       callback(err, res[0])
   });
};

function computeFinderPriceStats(callback){
  Finder.aggregate([
    {$group: {	_id: null,
	    		minPriceAvg: {$avg: "$minPrice"},
	    		maxPriceAvg: {$avg: "$maxPrice"}
	    	}
	     },
	      {$project:
          { _id:0 }
	     }
  ],function(err, res){
     callback(err, res[0])
 });

};

function computeFinderKeyWordsStats(callback){
  Finder.aggregate([
    {"$sortByCount": {"$toLower": "$keyWord"}},
	  { "$limit": 10 },
	  {$project: {keyWord:"$_id", _id:0, count:"$count"}}
  ],function(err, res){
     var res_ls = res.map(function(rankingObject) { return rankingObject.keyWord; });
     callback(err, res_ls)
   });
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;
