'use strict';

/*---------------Application----------------------*/
var mongoose = require('mongoose'),
    Application = mongoose.model('Application'),
    Actor = mongoose.model('Actor')
    Trip = mongoose.model('Trip');
var authController = require('./authController');

/*---------------Methods---------------------*/

exports.list_all_applications = function (req, res) {
  var match = {};

  if(req.query.explorer){
    match.explorer = req.query.explorer;
  }

  if(req.query.manager){
    var manager_id = req.query.manager;
    Trip.find( {manager:manager_id}, '_id' , function (err, trips) {
        if(err){
            res.status(500).send(err);
        }
        else{
            match.trip = trips
        }
    })
  }

  if(req.query.status){
      match.status = req.query.status;
  }

  Application.find(match, function (err, applications) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(applications);
        }
    });
};



exports.list_all_applications_v2 = async function (req, res) {
    

    if (req.query.explorer || req.query.manager){
        var idToken = req.headers['idtoken'];
        var authenticatedUserId = await authController.getUserId(idToken);
        var role;
        Actor.findById(authenticatedUserId, function(err, actor) {
            if (err){
                res.status(500).send(err);
            }
            else{
            role = actor.role
            }
        });
    }

    var match = {};
    
    if(req.query.explorer){
        if (!role.includes("EXPLORER")){
            res.status(403).send('The authenticated Actor is not an explorer');
        }
        else if (authenticatedUserId != req.query.explorer){
            res.status(403).send('The authenticated Actor is trying to read the applications of another explorer');
        }
        else{
            match.explorer = req.query.explorer;
        }
    }
  
    if(req.query.manager){
        if (!role.includes("MANAGER")){
            res.status(403).send('The authenticated Actor is not a manager');
        }
        else if (authenticatedUserId != req.query.explorer){
            res.status(403).send('The authenticated Actor is trying to read the applications managed by another manager');
        }
        else{
            var manager_id = req.query.manager;
            Trip.find( {manager:manager_id}, '_id' , function (err, trips) {
                if(err){
                    res.status(500).send(err);
                }
                else{
                    match.trip = trips
                }
            })
        }
    }
  
    if(req.query.status){
        match.status = req.query.status;
    }
  
    Application.find(match, function (err, applications) {
          if (err) {
              res.send(err);
          }
          else {
              res.json(applications);
          }
      });
};
  

  
exports.list_all_applications_manager = function (req, res) {
    // Managers can only read the applications for the trips that they manage
    var manager_id = req.params.managerId;
    
    Trip.find( {manager:manager_id}, '_id' , function (err, trips) {
        if(err){
            res.status(500).send(err);
        }
        else{
            var match = {trip: trips}
        
            if(req.query.status){
                var statusName=req.query.status;
                match.status = statusName;
            }
            console.log(match)

            Application.find(match, function (err, applications) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(applications);
                }
            });
        }
    })
  };


exports.list_all_applications_manager_v2 = async function (req, res) {
    // Managers can only read the applications for the trips that they manage
    var manager_id = req.params.managerId;
    
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (authenticatedUserId != manager_id){
        res.status(403).send('The Manager is trying to read the applications of the trips managed by another manager');
    }
    else{
    Trip.find( {manager:manager_id}, '_id' , function (err, trips) {
        if(err){
            res.status(500).send(err);
        }
        else{
            var match = {trip: trips}
        
            if(req.query.status){
                var statusName=req.query.status;
                match.status = statusName;
            }
            console.log(match)

            Application.find(match, function (err, applications) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(applications);
                }
            });
        }
    
    })
    }
};


exports.list_all_applications_explorer = function (req, res) {
    // Explorers can only read the applications they have made
    var explorer_id = req.params.explorerId;
    
    var match = {explorer: explorer_id};
    if(req.query.status){
        var statusName=req.query.status;
        match.status = statusName;
    }
  
    Application.find(match, function (err, applications) {
          if (err) {
              res.send(err);
          }
          else {
              res.json(applications);
          }
      });
  };


exports.list_all_applications_explorer_v2 = async function (req, res) {
    // Explorers can only read the applications they have made
    var explorer_id = req.params.explorerId;
    
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (authenticatedUserId != explorer_id){
        res.status(403).send('The Explorer is trying to read the applications of another explorer');
    }

    var match = {explorer: explorer_id};
    if(req.query.status){
        var statusName=req.query.status;
        match.status = statusName;
    }
  
    Application.find(match, function (err, applications) {
          if (err) {
              res.send(err);
          }
          else {
              res.json(applications);
          }
      });
};


exports.create_an_application = function (req, res) {
    var new_application = new Application(req.body);
    if(!req.body.trip){
      res.status(422).send("Trip not defined");
    }
    else{
      Trip.findOne({_id:req.body.trip}, function(err_trip, trip){
        if(err_trip){
          if (err_trip.name == 'ValidationError') {
              res.status(422).send(err);
          }
          else {
              res.status(500).send(err);
          }
        }
        else{
          if(!trip.published){
            res.status(422).send("Cannot create application because trip is not published yet");
          }
          else if ((trip.startDate < new Date())){
            res.status(422).send("Cannot create application because trip has already started");
          }
          else if (trip.cancelled){
            res.status(422).send("Cannot create application because trip is cancelled");
          }
          else{
            new_application.save(function (err, application) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        res.status(422).send(err);
                    }
                    else {
                        res.status(500).send(err);
                    }
                }
                else {
                    res.json(application);
                }
            });
          }
        }
      });
    }

};

exports.read_an_application = function (req, res) {
    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(application);
        }
    });
};

exports.update_an_application = function (req, res) {
    Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true, runValidators:true}, function (err, application) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(application);
        }
    });
};

// Explorers can pay the trip fee
exports.pay_application = function(req,res){
    // Get new status
    var newStatus = null;
    if(req.query.status){
        var newStatus=req.query.status;
    }


    Application.findById(req.params.applicationId, function (err, appli) {
        if (err) {
            res.send(err);
        }
        else {
            var status = appli.status;
            var condition = (status=="DUE" && newStatus=="ACCEPTED");

            if(condition){
                Application.findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": newStatus , "paid": true}}, {new: true}, function (err1, appli1) {
                    if (err1) {
                        if (err1.name == 'ValidationError') {
                            res.status(422).send(err);
                        }
                        else {
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.json(appli1);
                    }
                });
            }
            else{
              res.status(422).send("status not valid"+ newStatus);
            }
        }
    });
};

// Explorer can cancelled application
exports.cancel_application = function(req,res){
    // Get new status
    var newStatus = null;
    if(req.query.status){
        var newStatus=req.query.status;
    }


    Application.findById(req.params.applicationId, function (err, appli) {
        if (err) {
            res.send(err);
        }
        else {
            var status = appli.status;
            var condition = (status=="ACCEPTED" && newStatus=="CANCELLED");

            if(condition){
                Application.findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": newStatus }}, {new: true}, function (err1, appli1) {
                    if (err1) {
                        if (err1.name == 'ValidationError') {
                            res.status(422).send(err);
                        }
                        else {
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.json(appli1);
                    }
                });
            }
            else{
              res.status(422).send("status not valid"+ newStatus);
            }
        }
    });
};


// Managers can change the applications' status from pending to rejected or from pending to due.
exports.change_status_application = function(req,res){
    // Get new status
    var newStatus = null;
    if(req.query.status){
        var newStatus=req.query.status;
    }


    Application.findById(req.params.applicationId, function (err, appli) {
        if (err) {
            res.send(err);
        }
        else {
            var status = appli.status;
            var condition =
                (status=="PENDING" && (newStatus=="DUE" || newStatus=="REJECTED"));

            if(condition){
                Application.findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": newStatus }}, {new: true}, function (err1, appli1) {
                    if (err1) {
                        if (err1.name == 'ValidationError') {
                            res.status(422).send(err);
                        }
                        else {
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.json(appli1);
                    }
                });
            }
            else{
              res.status(422).send("status not valid"+ newStatus);
            }
        }
    });
};




exports.delete_an_application = function (req, res) {
    Application.deleteOne({_id: req.params.applicationId}, function (err, application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({message: 'Application successfully deleted'});
        }
    });
};


exports.delete_all_applications = function(req, res) {
    Application.deleteMany({}, function(err, applications) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'All applications successfully deleted' });
        }
    });
};
