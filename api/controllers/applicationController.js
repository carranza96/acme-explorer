'use strict';

/*---------------Application----------------------*/
var mongoose = require('mongoose'),
    Application = mongoose.model('Application');

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


exports.change_status_application = function(req,res){
    // Get new status
    var newStatus = null;
    if(req.query.status){
        var newStatus=req.query.status;
    }


    Application.findById(req.params.applicationId, function (err, application) {
        if (err) {
            res.send(err);
        }
        else {
            var status = application.status;
            var condition = 
                (status=="PENDING" && (newStatus=="DUE" || newStatus=="REJECTED")) ||
                (status=="DUE" & newStatus=="ACCEPTED")
                (status=="ACCEPTED" & newStatus=="CANCELLED");
            
            if(condition){
                findOneAndUpdate({_id: req.params.applicationId}, { $set: {"status": newStatus }}, {new: true}, function (err1, application) {
                    if (err1) {
                        if (err1.name == 'ValidationError') {
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


