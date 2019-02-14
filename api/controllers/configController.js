'use strict';
/*---------------CONFIG----------------------*/
var mongoose = require('mongoose'),
  Config = mongoose.model('Configs');

  exports.init_config = function(req, res) {
    newConfig = new Config();
    Config.find({}, function(err, configs){
      if(err){
        res.send(err);
      }
      if(!configs.length){
        newConfig.save(function(err1, configs1){
            if(err1){
              res.status(500).send(err1);
            }
            else{
              res.json(configs1);
            }
        });
      }
    });
  };

  exports.get_config = function(req, res) {

      Config.find({}, function(err, config_ls) {
          if (err){
            res.send(err);
          }
          else{
            if(!config_ls.length){
              res.status(404).send('there is no config')
            }
            else{
              res.json(config_ls[0]);
            }
          }
      });
  };

  exports.update_config = function(req, res) {
      //Check that the user is the proper actor and if not: res.status(403); "an access token is valid, but requires more privileges"

      Config.find({}, function(err, config_ls) {
          if (err){
            res.send(err);
          }
          else{
            if(!config_ls.length){
              res.status(404).send('there is no config')
            }
            else{
              var id = res._id;
              Config.findOneAndUpdate({_id: id}, req.body, {new: true}, function(err, config) {
                if (err){
                  if(err.name=='ValidationError') {
                      res.status(422).send(err);
                  }
                  else{
                    res.status(500).send(err);
                  }
                }
                else{
                    res.json(config);
                }
              });
            }
          }
      });
  };

  exports.delete_config = function(req, res) {
      Actor.remove({}, function(err, config) {
          if (err){
              res.send(err);
          }
          else{
              res.json({ message: 'config successfully deleted' });
          }
      });
  };
