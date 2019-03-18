'use strict';
/*---------------CONFIG----------------------*/
var mongoose = require('mongoose'),
  Config = mongoose.model('Config');


function createInitialConfig(){
  var newConfig = new Config();

  Config.find({}, function(err, configs){
    if(err){
      console.log("Error initializing config")
    }
    if(!configs.length){
      newConfig.save(function(err, configs){
          if(err){
            console.log("Error initializing config")
          }
          else{
            console.log("Config succesfully saved")
          }
      });
    }
    else{
      console.log("Config already initialized")
    }
  });
}


exports.init_config = function(req, res) {
  var newConfig = new Config();
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
    else{
      res.status(422).send("Config already initialized")
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
              var config_res = config_ls[0];
              res.json(config_res);
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
              var id = config_ls[0]._id;
              var v = config_ls[0].__v;
              req.body._id = id;
              req.body.__v = v;
              Config.findOneAndUpdate({_id: id}, req.body, {new: true}, function(err1, config) {
                if (err1){
                  if(err1.name=='ValidationError') {
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
      Config.deleteMany({}, function(err, config) {
          if (err){
              res.send(err);
          }
          else{
              res.json({ message: 'config successfully deleted' });
          }
      });
  };


module.exports.createInitialConfig = createInitialConfig;