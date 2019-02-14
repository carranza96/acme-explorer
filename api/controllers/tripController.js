'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips');

exports.list_all_trips = function(req, res) {
    var match = {};
    if(req.query.search){
        var searchWord=req.query.search;
        match = {$text:{$search:searchWord}},
    }
    Trip.find(match, function(err, trips) {
        if (err){
          res.send(err);
        }
        else{
            res.json(trips);
        }
    });
};

exports.create_a_trip = function(req, res) {
  var new_trip = new Trip(req.body);
  new_trip.save(function(err, trip) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(trip);
    }
  });
};

exports.read_a_trip = function(req, res) {
  Trip.findById(req.params.tripId, function(err, trip) {
    if (err){
      res.send(err);
    }
    else{
      res.json(trip);
    }
  });
};

exports.update_a_trip = function(req, res) {
    //Check that the user is the proper trip and if not: res.status(403); "an access token is valid, but requires more privileges"
    Trip.findOneAndUpdate({_id: req.params.tripId}, req.body, {new: true}, function(err, trip) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
          res.json(trip);
      }
    });
};

exports.delete_a_trip = function(req, res) {
    Trip.deleteOne({_id: req.params.tripId}, function(err, trip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Trip successfully deleted' });
        }
    });
};

exports.delete_all_trips = function(req, res) {
    Trip.remove({}, function(err, trip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'All trips successfully deleted' });
        }
    });
};