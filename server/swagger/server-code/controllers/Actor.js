'use strict';

var utils = require('../utils/writer.js');
var Actor = require('../service/ActorService');

module.exports.addActor = function addActor (req, res, next) {
  var body = req.swagger.params['body'].value;
  Actor.addActor(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.ban_actor = function ban_actor (req, res, next) {
  var actorId = req.swagger.params['actorId'].value;
  Actor.ban_actor(actorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.delete_actor_by_id = function delete_actor_by_id (req, res, next) {
  var actorId = req.swagger.params['actorId'].value;
  Actor.delete_actor_by_id(actorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.delete_actors = function delete_actors (req, res, next) {
  Actor.delete_actors()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_actor_by_id = function get_actor_by_id (req, res, next) {
  var actorId = req.swagger.params['actorId'].value;
  Actor.get_actor_by_id(actorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_actors = function get_actors (req, res, next) {
  var role = req.swagger.params['role'].value;
  Actor.get_actors(role)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.unban_actor = function unban_actor (req, res, next) {
  var actorId = req.swagger.params['actorId'].value;
  Actor.unban_actor(actorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.update_actor = function update_actor (req, res, next) {
  var body = req.swagger.params['body'].value;
  var actorId = req.swagger.params['actorId'].value;
  Actor.update_actor(body,actorId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
