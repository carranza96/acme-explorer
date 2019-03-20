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
    

    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    var role;
    Actor.findById(authenticatedUserId, function(err, actor) {
        if (err){
            res.status(500).send(err);
        }
        else{
            role = actor.role

            var match = {};

            if(!req.query.manager && !req.query.explorer && !role.includes("ADMINISTRATOR") ){
                    res.status(403).send('The authenticated Actor is trying to read the applications all the applications and is not an ADMINISTRATOR');
            }
    
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
          else if ((trip.startDate > new Date())){
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


exports.read_an_application_v2 = async function (req, res) {
    // Get role of user
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    var role;
    Actor.findById(authenticatedUserId, function(err, actor) {
        if (err){
            res.status(500).send(err);
        }
        else{
            role = actor.role
            Application.findById(req.params.applicationId, function (err, application) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    if(role.includes("ADMINISTRATOR")){
                        res.json(application);
                    }
                    // Explorer can only read their applications
                    else if(role.includes("EXPLORER")){
                        if(authenticatedUserId != application.explorer ){
                            res.status(403).send('The authenticated Explorer is trying to read an application of another explorer');
                        }
                        else{
                            res.json(application);
                        }
                    }
                    // Manager can only read an application if it is for a trip that they manage
                    else if(role.includes("MANAGER")){
                        var trip_id = application.trip;
                        Trip.findById(trip_id, function(err,trip){
                            if (err){
                                res.status(500).send(err);
                            }
                            else{
                                if(authenticatedUserId != trip.manager){
                                    res.status(403).send('The authenticated Manager is trying to read an application of a trip that is managed by another manager');
                                }
                                else{
                                    res.json(application);
                                }
                            }
        
                        })
        
                    }
                    else{
                        res.status(405).send('The Actor does not have proper roles');
                    }
        
                }
            })
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
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            res.json(application);
        }
    });
};



exports.update_an_application_v2 = function (req, res) {
    Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true, runValidators:true}, async function (err, application) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            // Get role of user
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

                if(role.includes("ADMINISTRATOR")){
                    res.json(application);
                }
                // Explorer can only read their applications
                else if(role.includes("EXPLORER")){
                    if(authenticatedUserId != application.explorer ){
                        res.status(403).send('The authenticated Explorer is trying to read an application of another explorer');
                    }
                    else{
                        res.json(application);
                    }
                }
                // Manager can only read an application if it is for a trip that they manage
                else if(role.includes("MANAGER")){
                    var trip_id = application.trip;
                    Trip.findById(trip_id, function(err,trip){
                        if (err){
                            res.status(500).send(err);
                        }
                        else{
                            if(authenticatedUserId != trip.manager){
                                res.status(403).send('The authenticated Manager is trying to read an application of a trip that is managed by another manager');
                            }
                            else{
                                res.json(application);
                            }
                        }
    
                    })
    
                }
                else{
                    res.status(405).send('The Actor does not have proper roles');
                }
            });

           
        }
    });
};





// Managers can change the applications' status from pending to rejected or from pending to due.
exports.change_status_application = function(req,res){
    
    // Check that new status is provided
    var newStatus = null;
    if(req.body.status){
        var newStatus=req.body.status;
    }
    else{
        return res.status(422).send("Validation error: New status not provided");
    }

    // Check that reasonCancellation is provided if newStatus is REJECTED
    if (newStatus=="REJECTED" && !req.body.rejectReason){
        return res.status(422).send("Validation error: Reason of rejection not provided");
    }

    // Check that reasonCancellation is not provided if newStatus is ACCEPTED
    if (newStatus=="DUE" && req.body.rejectReason){
        return res.status(422).send("Validation error: Do not provide reason of rejection if changing status to DUE");
    }


    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
            res.send(err);
        }
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            var status = application.status;
            var condition =
                (status=="PENDING" && (newStatus=="DUE" || newStatus=="REJECTED"));

            if(condition){
                Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true, runValidators:true}, function (err, application) {
                    if (err) {
                        if (err.name == 'ValidationError') {
                            res.status(422).send(err);
                        }
                        else {
                            res.status(500).send(err);
                        }
                    }
                    else{
                        res.json(application);
                    }
                });
            }
            else{
              res.status(422).send(`Validation error: Change from status ${status} to ${newStatus} not valid`);
            }
        }
    });
};


// Managers can change the applications' status from pending to rejected or from pending to due.
exports.change_status_application_v2 = function(req,res){
    
    // Check that new status is provided
    var newStatus = null;
    if(req.body.status){
        var newStatus=req.body.status;
    }
    else{
        return res.status(422).send("Validation error: New status not provided");
    }

    // Check that reasonCancellation is provided if newStatus is REJECTED
    if (newStatus=="REJECTED" && !req.body.rejectReason){
        return res.status(422).send("Validation error: Reason of rejection not provided");
    }

    // Check that reasonCancellation is not provided if newStatus is ACCEPTED
    if (newStatus=="DUE" && req.body.rejectReason){
        return res.status(422).send("Validation error: Do not provide reason of rejection if changing status to DUE");
    }


    Application.findById(req.params.applicationId, async function (err, application) {
        if (err) {
            res.send(err);
        }
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            
            // Check that the manager manages the trip of the application
            var idToken = req.headers['idtoken'];
            var authenticatedUserId = await authController.getUserId(idToken);
            var trip_id = application.trip;
            Trip.findById(trip_id, function(err,trip){
                if (err){
                    res.status(500).send(err);
                }
                else{
                    if(authenticatedUserId != trip.manager){
                        res.status(403).send('The authenticated Manager is trying to update an application of a trip that is managed by another manager');
                    }
                    else{
                        var status = application.status;
                        var condition = (status=="PENDING" && (newStatus=="DUE" || newStatus=="REJECTED"));
                        if(condition){
                            Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true, runValidators:true}, function (err, application) {
                                if (err) {
                                    if (err.name == 'ValidationError') {
                                        res.status(422).send(err);
                                    }
                                    else {
                                        res.status(500).send(err);
                                    }
                                }
                                else{
                                    res.json(application);
                                }
                            });
                        }
                        else{
                          res.status(422).send(`Validation error: Change from status ${status} to ${newStatus} not valid`);
                        }
                    }
                }
            })
            
        }
    });
};



// Explorers can pay the trip fee
exports.pay_application = function(req,res){

    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
            res.send(err);
        }
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            var status = application.status;
            var condition = (status=="DUE");

            if(condition){
                Application.findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": "ACCEPTED", "paid": true}}, {new: true, runValidators:true}, function (err, application) {
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
            else{
              res.status(422).send(`Validation error: Cannot pay application that has status ${status}. The application has to be in status DUE in order to be paid`);
            }
        }
    });
};



// Explorers can pay the trip fee
exports.pay_application_v2 = function(req,res){

    Application.findById(req.params.applicationId, async function (err, application) {
        if (err) {
            res.send(err);
        }
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            // Check that the authenticated explorer made the  application
            var idToken = req.headers['idtoken'];
            var authenticatedUserId = await authController.getUserId(idToken);
            if (authenticatedUserId != application.explorer){
                res.status(403).send('The authenticated Explorer is trying to pay an application made by another explorer');

            }
            else{
                var status = application.status;
                var condition = (status=="DUE");
    
                if(condition){
                    Application.findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": "ACCEPTED", "paid": true}}, {new: true, runValidators:true}, function (err, application) {
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
                else{
                  res.status(422).send(`Validation error: Cannot pay application that has status ${status}. The application has to be in status DUE`);
                }
            }
            
        }
    });
};



// Explorer can cancel application
exports.cancel_application = function(req,res){

    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
            res.send(err);
        }
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            var status = application.status;
            var condition = (status=="ACCEPTED" || status=="PENDING");

            if(condition){
                Application.findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": "CANCELLED" }}, {new: true, runValidators:true}, function (err, application) {
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
            else{
                res.status(422).send(`Validation error: Cannot cancel application that has status ${status}. The application has to be in status ACCEPTED or PENDING in order to be cancelled`);
            }
        }
    });
};



// Explorer can cancel application
exports.cancel_application_v2 = function(req,res){

    Application.findById(req.params.applicationId, async function (err, application) {
        if (err) {
            res.send(err);
        }
        else if(!application){
            return res.status(404).send(`Application with id ${req.params.applicationId} does not exist in database`);      
        }
        else {
            // Check that the authenticated explorer made the  application
            var idToken = req.headers['idtoken'];
            var authenticatedUserId = await authController.getUserId(idToken);
            if (authenticatedUserId != application.explorer){
                res.status(403).send('The authenticated Explorer is trying to pay an application made by another explorer');

            }
            else{
                var status = application.status;
                var condition = (status=="ACCEPTED" || status=="PENDING");
    
                if(condition){
                    Application.findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": "CANCELLED" }}, {new: true, runValidators:true}, function (err, application) {
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
                else{
                    res.status(422).send(`Validation error: Cannot cancel application that has status ${status}. The application has to be in status ACCEPTED or PENDING in order to be cancelled`);
                }
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
