'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
    Finder = mongoose.model('Finder'),
    Trip = mongoose.model('Trip'),
    Config = mongoose.model('Config');

function get_results_finder(finder){
    // Build query filters
    var query = {}

    // KeyWord
    if (finder.keyWord){
        query.$text = {$search: finder.keyWord}
    }

    if (finder.minPrice || finder.maxPrice){
        query.price = {}
        if(finder.minPrice){
            query.price.$gte = finder.minPrice
        }
        if(finder.maxPrice){
            query.price.$lte = finder.maxPrice
        }
    }

    // Date range
    if(finder.minDate || finder.maxDate){
        query.startDate = {}
        query.endDate = {}
        if (finder.minDate){
            query.startDate.$gte = finder.minDate
            query.endDate.$gte = finder.minDate
        }
        if(finder.maxDate){
            query.startDate.$lte = finder.maxDate
            query.endDate.$lte = finder.maxDate
        }
    }
    
    return new Promise( function(resolve,reject){
        // Get max limit of trips
        Config.findOne(function(err,config){
            if(err){
                reject(new Error(err));
            }
            else{
                var limit = config.finderResultNumber;
                Trip.find(query)
                .limit(limit)
                .lean()
                .exec(function (err, trips) {
                    if (err) {
                        reject(new Error(err));
                    }
                    else{
                        resolve(trips);
                    }
                })
            }
        })
  });
}

exports.list_all_finders  = function (req, res) {
    Finder.find({}, function (err, finder ) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(finder);
        }
    });
};


exports.create_a_finder =  function (req, res) {
    var new_finder = new Finder(req.body);
    get_results_finder(new_finder)
        .then( trips => {
            new_finder.results = trips;
            new_finder.save(function (err, finder ) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        res.status(422).send(err);
                    }
                    else {
                        res.status(500).send(err);
                    }
                }
                else {
                    res.json(finder)
                }
            });
        })
        .catch(e => res.status(500).send(err))

};


exports.read_a_finder  = function (req, res) {
    Finder.findById(req.params.finderId, function (err, finder ) {
        if (err) {
            res.status(500).send(err);
        }
        else if(!finder){
            res.status(404).send(`Finder with id ${req.params.finderId} does not exist in database`);
        }
        else {
            // Get results of a finder if empty
            if(finder.results.length == 0){
                get_results_finder(finder).then( trips => {
                    finder.results = trips;
                    finder.lastUpdate = Date.now();
                    res.json(finder)
                }).catch(e => res.status(500).send(err))
            }
            else{
                res.json(finder)
            }
            
        }
    });
};


exports.update_a_finder  = function (req, res) {
    var new_finder = req.body;

    get_results_finder(new_finder).then(trips => {
        new_finder.lastUpdate = Date.now();
        new_finder.results = trips;

        Finder.findOneAndUpdate({ _id: req.params.finderId }, new_finder, { new: true, runValidators:true, context:'query' }, function (err, finder ) {
            if (err) {
                if (err.name == 'ValidationError') {
                    res.status(422).send(err);
                }
                else {
                    res.status(500).send(err);
                }
            }
            else if(!finder){
                res.status(404).send(`Finder with id ${req.params.finderId} does not exist in database`);
            }
            else {
                res.json(finder)
            }
        });
        
    }).catch(e => res.status(500).send(err))
        


   
};


exports.delete_a_finder  = function (req, res) {
    Finder.deleteOne({ _id: req.params.finderId }, function (err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'Finder successfully deleted' });
        }
    });
};

exports.delete_all_finders  = function (req, res) {
    Finder.deleteMany({}, function (err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ message: 'All finders successfully deleted' });
        }
    });
};



var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

var rebuildPeriod = '*/5 * * * *';  //El que se usará por defecto 5 minutos
var computeCacheCleanerJob;

exports.rebuildPeriod = function(req, res) {
    console.log('Updating rebuild period. Request: period:'+req.query.rebuildPeriod);
    rebuildPeriod = req.query.rebuildPeriod;
    computeCacheCleanerJob.setTime(new CronTime(rebuildPeriod));
    computeCacheCleanerJob.start();

    res.json(req.query.rebuildPeriod);
};

function createCacheCleanerJob(){
    computeCacheCleanerJob = new CronJob(rebuildPeriod,  function() {
    Config.findOne({}, function(err,config){
        if (err){
            console.log("Error cleaning cache: "+err);
        }
        else{
           
            
            var maxCacheTime = config.finderResultCacheTime;
            var MS_PER_MINUTE = 60000;
            var lastValidDate = new Date(Date.now() - maxCacheTime * MS_PER_MINUTE);

            var query = {lastUpdate: {$lte: lastValidDate}}
            Finder.findOneAndUpdate(query, {$set: {"results":[]}}, {new:true, runValidators:true}, function (err, finder) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        console.log("Error cleaning cache: "+err);
                    }
                    else {
                        console.log("Error cleaning cache: "+err);
                    }
                  }
                else{
                    console.log("Finder Cache succesfully cleaned Date: "+new Date());
                }
            })

        }
    })
  }, null, true, 'Europe/Madrid');
}


module.exports.createCacheCleanerJob = createCacheCleanerJob;
