'use strict';

/*---------------Sponsorship----------------------*/
var mongoose = require('mongoose'),
    Sponsorship = mongoose.model('Sponsorship');

/*---------------Methods---------------------*/
exports.list_all_sponsorships = function (req, res) {
    var match = {};
    if (req.query.sponsor) {
        match = { sponsor: req.query.sponsor };
    }
    Sponsorship.find(match, function (err, sponsorships) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(sponsorships);
        }
    });
};


exports.list_all_sponsorships_v2 = async function (req, res) {
    var match = {};
    if (req.query.sponsor) {
        match = { sponsor: req.query.sponsor };
    }
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

        Sponsorship.find(match, function (err, sponsorships) {
            if (err) {
                res.send(err);
            }
            else {
                if(role.includes("ADMINISTRATOR")){
                    res.json(sponsorships);
                }
                else {
                    if(req.query.sponsor){
                        if(authenticatedUserId==req.query.sponsor){
                            res.json(sponsorships);
                        }
                        else{
                            res.status(403).send("The authenticated sponsor is trying to read the sponsorships of another sponsor")
                        }
                    }
                    else{
                        res.status(403).send("The authenticated sponsor is trying to read all sponsorships")
                    }
                }
            }
        });
    })
    
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

exports.read_a_sponsorship_v2 = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
        if (err) {
            res.send(err);
        }
        else if(!sponsorship){
            res.status(404).send(`Sponsorship with id ${req.params.sponsorshipId} does not exist in database`);
        }
        else if(sponsorship.sponsor!= authenticatedUserId){
            res.status(403).send(`Sponsor with id ${authenticatedUserId} is trying to read the sponsorship of another sponsor`);
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
        else if(!sponsorship){
            res.status(404).send(`Sponsorship with id ${req.params.sponsorshipId} does not exist in database`);
        }
        else {
            res.json(sponsorship);
        }
    });
};

exports.update_a_sponsorship_v2 = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new: true}, function (err, sponsorship) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else if(!sponsorship){
            res.status(404).send(`Sponsorship with id ${req.params.sponsorshipId} does not exist in database`);
        }
        else if(sponsorship.sponsor!= authenticatedUserId){
            res.status(403).send(`Sponsor with id ${authenticatedUserId} is trying to read the sponsorship of another sponsor`);
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
        else if(!sponsorship){
            res.status(404).send(`Sponsorship with id ${req.params.sponsorshipId} does not exist in database`);
        }
        else {
            res.json({message: 'Sponsorship successfully deleted'});
        }
    });
};

exports.delete_a_sponsorship_v2 = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Sponsorship.deleteOne({_id: req.params.sponsorshipId}, function (err, sponsorship) {
        if (err) {
            res.send(err);
        }
        else if(!sponsorship){
            res.status(404).send(`Sponsorship with id ${req.params.sponsorshipId} does not exist in database`);
        }
        else if(sponsorship.sponsor!= authenticatedUserId){
            res.status(403).send(`Sponsor with id ${authenticatedUserId} is trying to read the sponsorship of another sponsor`);
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