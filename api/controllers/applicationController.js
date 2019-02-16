'use strict';

/*---------------Application----------------------*/
var mongoose = require('mongoose'),
    Application = mongoose.model('Applications');

/*---------------Methods---------------------*/
exports.list_all_applications = function (req, res) {
    Application.find({}, function (err, applications) {
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

    new_application.save(function (err, Application) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(Application);
        }
    });
};

exports.read_an_application = function (req, res) {
    Application.findById(req.params.applicationId, function (err, Application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(Application);
        }
    });
};

exports.update_an_application = function (req, res) {
    Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true}, function (err, Application) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(Application);
        }
    });
};


exports.delete_an_application = function (req, res) {
    Application.deleteOne({_id: req.params.applicationId}, function (err, Application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({message: 'Application successfully deleted'});
        }
    });
};
