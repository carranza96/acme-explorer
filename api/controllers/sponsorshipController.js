'use strict';

/*---------------Sponsorship----------------------*/
var mongoose = require('mongoose'),
    Sponsorship = mongoose.model('Sponsorship');

/*---------------Methods---------------------*/
exports.list_all_sponsorships = function (req, res) {
    Sponsorship.find({}, function (err, sponsorships) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(sponsorships);
        }
    });
};

exports.create_a_sponsorship = function (req, res) {
    var new_sponsorship = new Sponsorship(req.body);

    new_sponsorship.save(function (err, sponsorship) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(sponsorship);
        }
    });
};

exports.read_a_sponsorship = function (req, res) {
    Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(sponsorship);
        }
    });
};

exports.update_a_sponsorship = function (req, res) {
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new: true}, function (err, sponsorship) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(sponsorship);
        }
    });
};


exports.delete_a_sponsorship = function (req, res) {
    Sponsorship.deleteOne({_id: req.params.sponsorshipId}, function (err, sponsorship) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({message: 'Sponsorship successfully deleted'});
        }
    });
};


exports.delete_all_sponsorships = function(req, res) {
    Sponsorship.deleteMany({}, function(err, sponsorships) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'All sponsorships successfully deleted' });
        }
    });
};