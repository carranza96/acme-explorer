'use strict';

/*---------------Application----------------------*/
var mongoose = require('mongoose'),
    Application = mongoose.model('Application')
    Trip = mongoose.model('Trip');
var authController = require('./authController');

/*---------------Methods---------------------*/
exports.list_all_applications = function (req, res) {
  var match = {};
  if(req.query.status){
      var statusName=req.query.status;
      match = {status:statusName};
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
          var condition = (trip.published) && (trip.startDate < new Date()) && (!trip.cancelled);
          if(!condition){
            res.status(422).send("Trip not valid");
          }else{
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
    Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true}, function (err, application) {
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
