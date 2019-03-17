'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trip'),
  Application = mongoose.model('Application');
  var authController = require('./authController');

exports.list_all_trips = function (req, res) {
  //Check if the manager param exist
  var match = {};
  if(req.query.manager){
      var manager_id=req.query.manager;
      match = {manager:manager_id};
  }
  console.log(match)

  Trip.find(match, function (err, trips) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(trips);
    }
  });
};

// /trips/search?q="searchString"&reverse="false|true"&startFrom="valor"&pageSize="tam"
exports.search_trips = function (req, res) {
  var query = {};

  if (req.query.q) {
    query.$text = {$search: req.query.q};
  }

  var skip=0;
  if(req.query.startFrom){
    skip = parseInt(req.query.startFrom);
  }
  var limit=0;
  if(req.query.pageSize){
    limit=parseInt(req.query.pageSize);
  }

  var sort="";
  if(req.query.reverse=="true"){
    sort="-";
  }
  if(req.query.sortedBy){
    sort+=req.query.sortedBy;
  }

  console.log("Query: "+query+" Skip:" + skip+" Limit:" + limit+" Sort:" + sort);

  Trip.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(function (err, trips) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(trips);
    }
  });
};

exports.create_a_trip = function (req, res) {
  var new_trip = new Trip(req.body);

  new_trip.save(function (err, trip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      res.json(trip);
    }
  });
};


exports.create_a_trip_v2 = async function (req, res) {
  var new_trip = new Trip(req.body);

  // Get id of manager that creates the trip
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  new_trip.manager = authenticatedUserId;

  new_trip.save(function (err, trip) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      trip
      res.json(trip);
    }
  });
};


exports.read_a_trip = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(trip);
    }
  });
};



exports.update_a_trip = function (req, res) {
  
  // Can only update if trip is not published
  var updated_trip = req.body

  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      return res.send(err);
    }
    else if (!trip){
      return res.status(404).send(`Trip with id ${req.params.tripId} does not exist in database`);
    }
    else{ 
      // Check if trying to cancel the trip
      if(updated_trip.cancelled=="true"){
        exports.cancel_a_trip(req, res);
      }

      if(trip.published){
        return res.status(422).send("Validation error: Trip cannot be modified because it is already published"); 
      }

      else{
        Trip.findOneAndUpdate({ _id: req.params.tripId }, updated_trip, { new: true, runValidators:true, context:'query' }, function (err, trip) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            }
            else {
              res.status(500).send(err);
            }
          }
          else {
            res.json(trip);
          }
        });
      }
    }
  });  

};




exports.update_a_trip_v2 = function (req, res) {
  
  // Can only update if trip is not published
  var updated_trip = req.body

  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      return res.send(err);
    }
    else if (!trip){
      return res.status(404).send(`Trip with id ${req.params.tripId} does not exist in database`);
    }
    else{ 
      // Check if manager does not manage the trip
      var idToken = req.headers['idtoken'];
      var authenticatedUserId = await authController.getUserId(idToken);
      if (authenticatedUserId != trip.manager){
        return res.status(403).send(`The Manager ${authenticatedUserId} is trying to update a trip that does not manage`);
      }

      // Check if trying to cancel the trip
      else if(updated_trip.cancelled=="true"){
        exports.cancel_a_trip(req, res);
      }

      if(trip.published){
        return res.status(422).send("Validation error: Trip cannot be modified because it is already published"); 
      }

      else{
        Trip.findOneAndUpdate({ _id: req.params.tripId }, updated_trip, { new: true, runValidators:true, context:'query' }, function (err, trip) {
          if (err) {
            if (err.name == 'ValidationError') {
              res.status(422).send(err);
            }
            else {
              res.status(500).send(err);
            }
          }
          else {
            res.json(trip);
          }
        });
      }
    }
  });  

};



exports.cancel_a_trip = function (req, res) {
  
  // Check that reasonCancellation is provided
  if (req.body.reasonCancellation){
    var reasonCancellation = req.body.reasonCancellation;
  }
  else{
    return res.status(422).send("Validation error: Reason of cancellation not provided");
  }

  
  Trip.findById(req.params.tripId, function(err,trip){
    if (err) {
      return res.send(err);
    }
    else if(!trip){
      return res.status(404).send(`Trip with id ${tripId} does not exist in database`);
    }
    else{

      if(trip.cancelled == true){
        return res.status(422).send("Validation error: The trip is already cancelled");
      }
      // Check conditions:
      // If the trip is published
      // - trip has not started
      // - trip does not have any existing applications
      else if(trip.published){
        if(trip.startDate < new Date()){
          return res.status(422).send("Validation error: The trip cannot be cancelled because it has already started");
        }

        else{
          Application.find({trip:trip.id, status: "ACCEPTED"}, function (err, applications) {
              if (err) {
                  return res.status(500).send(err);
              }
              else {
                if(applications.length != 0){
                  return res.status(422).send("Validation error: The trip cannot be cancelled because it has accepted applications");
                }
              }
          });
        }
      }
      Trip.findOneAndUpdate({ _id: req.params.tripId },  {$set: {cancelled:true, reasonCancellation:reasonCancellation}}, { new: true,  runValidators:true, context:'query'  }, function (err, trip) {
        if (err) {
          if (err.name == 'ValidationError') {
            res.status(422).send(err);
          }
          else {
            console.log(req.params.tripId)
            res.status(500).send(err);
          }
        }
        else {
          res.json(trip);
        }
      });
    }
  });
  
};


exports.cancel_a_trip_v2 = function (req, res) {
  
  // Check that reasonCancellation is provided
  if (req.body.reasonCancellation){
    var reasonCancellation = req.body.reasonCancellation;
  }
  else{
    return res.status(422).send("Validation error: Reason of cancellation not provided");
  }

  
  Trip.findById(req.params.tripId, async function(err,trip){
    if (err) {
      return res.send(err);
    }
    else if(!trip){
      return res.status(404).send(`Trip with id ${tripId} does not exist in database`);
    }
    else{
      // Check if manager does not manage the trip
      var idToken = req.headers['idtoken'];
      var authenticatedUserId = await authController.getUserId(idToken);
      if (authenticatedUserId != trip.manager){
        return res.status(403).send(`The Manager ${authenticatedUserId} is trying to update a trip that does not manage`);
      }

      else if(trip.cancelled == true){
        return res.status(422).send("Validation error: The trip is already cancelled");
      }

      // Check conditions:
      // If the trip is published
      // - trip has not started
      // - trip does not have any existing applications
      else if(trip.published){
        if(trip.startDate < new Date()){
          return res.status(422).send("Validation error: The trip cannot be cancelled because it has already started");
        }

        else{
          Application.find({trip:trip.id, status: "ACCEPTED"}, function (err, applications) {
              if (err) {
                  return res.status(500).send(err);
              }
              else {
                if(applications.length != 0){
                  return res.status(422).send("Validation error: The trip cannot be cancelled because it has accepted applications");
                }
              }
          });
        }
      }
      Trip.findOneAndUpdate({ _id: req.params.tripId },  {$set: {cancelled:true, reasonCancellation:reasonCancellation}}, { new: true,  runValidators:true, context:'query'  }, function (err, trip) {
        if (err) {
          if (err.name == 'ValidationError') {
            res.status(422).send(err);
          }
          else {
            console.log(req.params.tripId)
            res.status(500).send(err);
          }
        }
        else {
          res.json(trip);
        }
      });
    }
  });
  
};


exports.add_stage = function(req,res){
  var trip_id = req.params.tripId;
  var new_stage = req.body;
  console.log(trip_id)

  Trip.update({ _id: trip_id}, {$push: {stages: new_stage}}, {new:true, runValidators:true}, function (err, succ) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    }
    else {
      Trip.findById(trip_id, function (err, trip) {
        if(err){
          res.status(500).send(err);
        }
        else if(!trip){
          return res.status(404).send(`Trip with id ${trip_id} does not exist in database`);
        }
        else{
          var totalPrice = trip.price + new_stage.price;
          Trip.update({ _id: trip_id}, {$set: {price:totalPrice}}, {new:true, runValidators:true}, function(err_u, success){
            if(err){
              res.status(500).send(err);
            }else{
              trip.price=totalPrice;
              res.json(trip);
            }
          });
        }
      });
    }
  });
};


exports.add_stage_v2 = function(req,res){
  var trip_id = req.params.tripId;
  var new_stage = req.body;

  Trip.update({ _id: trip_id}, {$push: {stages: new_stage}}, {new:true, runValidators:true}, function (err, succ) {
    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    }
    else {
      Trip.findById(trip_id, async function (err, trip) {
        if(err){
          res.status(500).send(err);
        }
        else if(!trip){
          return res.status(404).send(`Trip with id ${trip_id} does not exist in database`);
        }
        else{
          // Check if manager does not manage the trip
          var idToken = req.headers['idtoken'];
          var authenticatedUserId = await authController.getUserId(idToken);
          if (authenticatedUserId != trip.manager){
            return res.status(403).send(`The Manager ${authenticatedUserId} is trying to update a trip that does not manage`);
          }

          else{
            var totalPrice = trip.price + new_stage.price;
            Trip.update({ _id: trip_id}, {$set: {price:totalPrice}}, {new:true, runValidators:true}, function(err, success){
              if(err){
                res.status(500).send(err);
              }else{
                trip.price=totalPrice;
                res.json(trip);
              }
            });
        }
        }
      });
    }
  });
};



exports.update_stage = function(req,res){
  var trip_id = req.params.tripId;
  var stage_id = req.params.stageId;
  var new_stage = req.body;
  new_stage._id = stage_id;

  Trip.update({ _id: trip_id, 'stages._id': stage_id},  {$set: {'stages.$': new_stage}}, {new:true, runValidators:true}, function (err, succ) {

    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    }
    else {
      Trip.findById(trip_id, function (err, trip) {
        if(err){
          res.status(500).send(err);
        }
        else if(!trip){
          return res.status(404).send(`Trip with id ${trip_id} does not exist in database`);
        }
        else{
          var stages_price = trip.stages.map((stage) => stage.price);
          var totalPrice = stages_price.reduce((a, b) => a + b, 0);

          Trip.update({ _id: trip_id}, {$set: {price:totalPrice}}, {new:true, runValidators:true}, function(err_u, success){
            if(err){
              res.status(500).send(err);
            }else{
              trip.price=totalPrice;
              res.json(trip);
            }
          });
        }
      });
    }
  });
};




exports.update_stage_v2 = function(req,res){
  var trip_id = req.params.tripId;
  var stage_id = req.params.stageId;
  var new_stage = req.body;
  new_stage._id = stage_id;

  Trip.update({ _id: trip_id, 'stages._id': stage_id},  {$set: {'stages.$': new_stage}}, {new:true, runValidators:true}, async function (err, succ) {

    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    }
    else {
       // Check if manager does not manage the trip
       var idToken = req.headers['idtoken'];
       var authenticatedUserId = await authController.getUserId(idToken);
       if (authenticatedUserId != trip.manager){
         return res.status(403).send(`The Manager ${authenticatedUserId} is trying to update a trip that does not manage`);
       }

      else{
        Trip.findById(trip_id, function (err, trip) {
        if(err){
          res.status(500).send(err);
        }
        else if(!trip){
          return res.status(404).send(`Trip with id ${trip_id} does not exist in database`);
        }
        else{
          var stages_price = trip.stages.map((stage) => stage.price);
          var totalPrice = stages_price.reduce((a, b) => a + b, 0);

          Trip.update({ _id: trip_id}, {$set: {price:totalPrice}}, {new:true, runValidators:true}, function(err_u, success){
            if(err){
              res.status(500).send(err);
            }else{
              trip.price=totalPrice;
              res.json(trip);
            }
          });
        }
      });
    }
  }
  });
};



exports.delete_stage = function(req,res){
  var trip_id = req.params.tripId;
  var stage_id = req.params.stageId;

  Trip.update({ _id: trip_id, 'stages._id': stage_id},  {$pull: { stages: {_id: stage_id } } }, {new:true, runValidators:true}, function (err, succ) {

    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    }
    else {
      Trip.findById(trip_id, function (err, trip) {
        if(err){
          res.status(500).send(err);
        }
        else if(!trip){
          return res.status(404).send(`Trip with id ${trip_id} does not exist in database`);
        }
        else{
          var stages_price = trip.stages.map((stage) => stage.price);
          var totalPrice = stages_price.reduce((a, b) => a + b, 0);

          Trip.update({ _id: trip_id}, {$set: {price:totalPrice}},  {new:true, runValidators:true} , function(err_u, success){
            if(err){
              res.status(500).send(err);
            }else{
              trip.price=totalPrice;
              res.json(trip);
            }
          });
        }
      });
    }
  });
};




exports.delete_stage_v2 = function(req,res){
  var trip_id = req.params.tripId;
  var stage_id = req.params.stageId;

  Trip.update({ _id: trip_id, 'stages._id': stage_id},  {$pull: { stages: {_id: stage_id } } }, {new:true, runValidators:true}, function (err, succ) {

    if (err) {
      if (err.name == 'ValidationError') {
        res.status(422).send(err);
      }
      else {
        console.log(err);
        res.status(500).send(err);
      }
    }
    else {
      Trip.findById(trip_id, async function (err, trip) {
        if(err){
          res.status(500).send(err);
        }
        else if(!trip){
          return res.status(404).send(`Trip with id ${trip_id} does not exist in database`);
        }
        else{
          // Check if manager does not manage the trip
          var idToken = req.headers['idtoken'];
          var authenticatedUserId = await authController.getUserId(idToken);
          if (authenticatedUserId != trip.manager){
            return res.status(403).send(`The Manager ${authenticatedUserId} is trying to update a trip that does not manage`);
          }
          else{
          var stages_price = trip.stages.map((stage) => stage.price);
          var totalPrice = stages_price.reduce((a, b) => a + b, 0);

          Trip.update({ _id: trip_id}, {$set: {price:totalPrice}},  {new:true, runValidators:true} , function(err_u, success){
            if(err){
              res.status(500).send(err);
            }
            else{
              trip.price=totalPrice;
              res.json(trip);
            }
          });
        }
      }
      });
    }
  });
};


exports.delete_a_trip = function (req, res) {

  // Can only delete if trip is not published

  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      return res.send(err);
    }
    else if (!trip){
      return res.status(404).send(`Trip with id ${tripId} does not exist in database`);
    }
    else {
      if(trip.published){
        return res.status(422).send("Validation error: Trip cannot be deleted because it is already published"); 
      }
      else{
        Trip.deleteOne({ _id: req.params.tripId }, function (err, trip) {
          if (err) {
            res.send(err);
          }
          else {
            res.json({ message: 'Trip successfully deleted' });
          }
        });
      }
    }
  });

};


exports.delete_a_trip_v2 = function (req, res) {

  // Can only update if trip is not published

  Trip.findById(req.params.tripId, async function (err, trip) {
    if (err) {
      return res.send(err);
    }
    else if (!trip){
      return res.status(404).send(`Trip with id ${tripId} does not exist in database`);
    }
    else {
       // Check if manager does not manage the trip
      var idToken = req.headers['idtoken'];
      var authenticatedUserId = await authController.getUserId(idToken);
      if (authenticatedUserId == trip.manager){
        return res.status(403).send(`The Manager ${authenticatedUserId} is trying to update a trip that does not manage`);
      }

      else if(trip.published){
        return res.status(422).send("Validation error: Trip cannot be deleted because it is already published"); 
      }

      else{
        Trip.deleteOne({ _id: req.params.tripId }, function (err, trip) {
          if (err) {
            res.send(err);
          }
          else {
            res.json({ message: 'Trip successfully deleted' });
          }
        });
      }
    }
  });

};



exports.delete_all_trips = function (req, res) {
  Trip.deleteMany({}, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'All trips successfully deleted' });
    }
  });
};



