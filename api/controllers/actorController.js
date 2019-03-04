'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actor');

exports.list_all_actors = function(req, res) {
    //Check if the role param exist
    var match = {};
    if(req.query.role){
        var roleName=req.query.role;
        match = {role:roleName};
    }
    Actor.find(match, function(err, actors) {
        if (err){
          res.send(err);
        }
        else{
            res.json(actors);
        }
    });
};

exports.create_an_actor = function(req, res) {
  var new_actor = new Actor(req.body);
  new_actor.save(function(err, actor) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(actor);
    }
  });
};


exports.login_an_actor = async function(req, res) {
  console.log('starting login an actor');
  var emailParam = req.query.email;
  var password = req.query.password;
  Actor.findOne({ email: emailParam }, function (err, actor) {
      if (err) { res.send(err); }

      // No actor found with that email as username
      else if (!actor) {
        res.status(401); //an access token isn’t provided, or is invalid
        res.json({message: 'forbidden',error: err});
      }

      else if ((actor.role.includes( 'CLERK' )) && (actor.validated == false)) {
        res.status(403); //an access token is valid, but requires more privileges
        res.json({message: 'forbidden',error: err});
      }
      else{
        // Make sure the password is correct
        //console.log('En actor Controller pass: '+password);
        actor.verifyPassword(password, async function(err, isMatch) {
          if (err) {
            res.send(err);
          }

          // Password did not match
          else if (!isMatch) {
            //res.send(err);
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({message: 'forbidden',error: err});
          }

          else {
              try{
                var customToken = await admin.auth().createCustomToken(actor.email);
              } catch (error){
                console.log("Error creating custom token:", error);
              }
              actor.customToken = customToken;
              console.log('Login Success... sending JSON with custom token');
              res.json(actor);
          }
      });
    }
  });
};


exports.read_an_actor = function(req, res) {
  Actor.findById(req.params.actorId, function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      res.json(actor);
    }
  });
};

exports.update_an_actor = function(req, res) {
    //Check that the user is the proper actor and if not: res.status(403); "an access token is valid, but requires more privileges"
    Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
          res.json(actor);
      }
    });
};

exports.ban_an_actor = function(req, res) {
    //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
    console.log("banning an actor with id: "+req.params.actorId)
    Actor.findOneAndUpdate({_id: req.params.actorId},  { $set: {"banned": "true" }}, {new: true}, function(err, actor) {
      if (err){
        res.send(err);
      }
      else{
        res.json(actor);
      }
    });
  };
exports.unban_an_actor = function(req, res) {
    //Check that the user is an Administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
    console.log("banning an actor with id: "+req.params.actorId)
    Actor.findOneAndUpdate({_id: req.params.actorId},  { $set: {"banned": "false" }}, {new: true}, function(err, actor) {
      if (err){
        res.send(err);
      }
      else{
        res.json(actor);
      }
    });
  };

exports.delete_an_actor = function(req, res) {
    Actor.deleteOne({_id: req.params.actorId}, function(err, actor) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Actor successfully deleted' });
        }
    });
};

exports.delete_all_actors = function(req, res) {
    Actor.deleteMany({}, function(err, actor) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'All actors successfully deleted' });
        }
    });
};
