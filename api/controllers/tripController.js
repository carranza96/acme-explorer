'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trip'),
  Application = mongoose.model('Application');


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
  //Check that the user is the proper trip and if not: res.status(403); "an access token is valid, but requires more privileges"
  // var opts = {new: true, runValidators:true, context: 'query'}
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

exports.cancel = function (req, res) {
  var set_attributes = {cancelled:true, reasonCancellation:req.query.reasonCancellation};
  Trip.findById(req.params.tripId,function(err,trip){
    if(trip==null){
      res.status(422).send("wrong trip id");
      return
    }
    if(trip.published){
      if(trip.startDate > new Date()){
        res.status(422).send("trip already started");
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
