'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
    Finder = mongoose.model('Finder');

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


exports.create_finder = function (req, res) {
    var new_finder = new Finder(req.body);
    new_finder .save(function (err, finder ) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(finder );
        }
    });
};

exports.read_a_finder  = function (req, res) {
    Finder.findById(req.params.finderId, function (err, finder ) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(finder );
        }
    });
};

exports.update_a_finder  = function (req, res) {
    // new: true means -> return the modified document rather than the original. defaults to false 
    // var opts = {new: true, runValidators:true, context: 'query'}
    Finder.findOneAndUpdate({ _id: req.params.finderId }, req.body, { new: true }, function (err, finder ) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(finder );
        }
    });
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
