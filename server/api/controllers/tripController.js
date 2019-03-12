'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trip'),
  Actor = mongoose.model('Actor'),
  Application = mongoose.model('Application');
  var admin = require('firebase-admin');
  var authController = require('./authController');
  var actorController = require('./actorController');

exports.list_all_trips = function (req, res) {
  Trip.find({}, function (err, trips) {
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

  Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
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

exports.cancel_a_trip = function (req, res) {
  
  // Check that reasonCancellation is provided
  if (req.body.reasonCancellation){
    var reasonCancellation = req.body.reasonCancellation;
  }
  else{
    res.status(422).send("Reason of cancellation not provided");
    return
  }


  var set_attributes = {cancelled:true, reasonCancellation:reasonCancellation};

  // Check conditions:
  // - reasonCancellation not blank
  // - trip has not started
  // - trip does not have any existing applications
  
  Trip.findById(req.params.tripId,function(err,trip){
    if (err) {
      res.send(err);
    }
    else{
      if(trip.published){
        if(trip.startDate > new Date()){
          res.status(422).send("The trip cannot be cancelled because it has already started");
          return;
        }
        else{
          Application.find({trip:trip.id, status: "ACCEPTED"}, function (err, applications) {
              if (err) {
                  res.status(500).send(err);
              }
              else {
                if(applications.length != 0){
                  res.status(422).send("trip has applications");
                  return;
                }
              }
          });
        }
      }
    }
  });


  Trip.update({ _id: req.params.tripId }, {$set: set_attributes}, { new: true }, function (err, succ) {
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
      Trip.findById(req.params.tripId, function(err1, trip){
        if(err1){
          res.status(500).send(err1);
        }else{
          res.json(trip);
        }
      });

    }
  });
};




exports.add_stage = function(req,res){
  var trip_id = req.params.tripId;
  var new_stage = req.body;
  console.log(trip_id);
  console.log(new_stage);
  Trip.update({ _id: trip_id}, {$push: {stages: new_stage}}, {new:true}, function (err, succ) {
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
      console.log("done");
      Trip.findById(trip_id, function (err, trip) {
        if(err){
          res.status(500).send(err);
        }else{
          var totalPrice = trip.price + new_stage.price;
          Trip.update({ _id: trip_id}, {$set: {price:totalPrice}}, function(err_u, success){
            if(err){

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

exports.delete_a_trip = function (req, res) {
  Trip.deleteOne({ _id: req.params.tripId }, function (err, trip) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Trip successfully deleted' });
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



/*---------------STAGE----------------------*/
