'use strict';


/**
 * Register a new actor to the store
 *
 * body Actor Actor object that needs to be register
 * no response value expected for this operation
 **/
exports.addActor = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Ban an actor
 * It set ban parameter of the actor with the id given in the parameters to True
 *
 * actorId String id of the actor we are banning
 * no response value expected for this operation
 **/
exports.ban_actor = function(actorId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete an actor
 * (This method is only for debugging)
 *
 * actorId String id of the actor we are deleting
 * no response value expected for this operation
 **/
exports.delete_actor_by_id = function(actorId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete all actors
 * (This method is only for debugging)
 *
 * no response value expected for this operation
 **/
exports.delete_actors = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get an actors by id
 * It returns the actor with the id in the url parameter.
 *
 * actorId String id of the actor we are looking for
 * returns Actor
 **/
exports.get_actor_by_id = function(actorId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "password" : "v3Ry$tR0nGp@$w0rD",
  "preferredLanguage" : "es",
  "address" : "Av. Reina Mercedes N1 41018, Sevilla",
  "role" : [ "EXPLORER", "EXPLORER" ],
  "phone" : "654123890",
  "surname" : "Fernandez",
  "created" : "created",
  "name" : "Manolo",
  "_id" : 0,
  "banned" : false,
  "email" : "manolo@example.com"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get all actors by role
 * If role parameter is notprovided it return the list of all actors
 *
 * role String Status values that need to be considered for filter (optional)
 * returns List
 **/
exports.get_actors = function(role) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "password" : "v3Ry$tR0nGp@$w0rD",
  "preferredLanguage" : "es",
  "address" : "Av. Reina Mercedes N1 41018, Sevilla",
  "role" : [ "EXPLORER", "EXPLORER" ],
  "phone" : "654123890",
  "surname" : "Fernandez",
  "created" : "created",
  "name" : "Manolo",
  "_id" : 0,
  "banned" : false,
  "email" : "manolo@example.com"
}, {
  "password" : "v3Ry$tR0nGp@$w0rD",
  "preferredLanguage" : "es",
  "address" : "Av. Reina Mercedes N1 41018, Sevilla",
  "role" : [ "EXPLORER", "EXPLORER" ],
  "phone" : "654123890",
  "surname" : "Fernandez",
  "created" : "created",
  "name" : "Manolo",
  "_id" : 0,
  "banned" : false,
  "email" : "manolo@example.com"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Unban an actor
 * It set ban parameter of the actor with the id given in the parameters to False
 *
 * actorId String id of the actor we are unbanning
 * no response value expected for this operation
 **/
exports.unban_actor = function(actorId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update an existing actor
 *
 * body Actor Actor object that needs to be updated to the system
 * actorId String id of the actor we are updating
 * no response value expected for this operation
 **/
exports.update_actor = function(body,actorId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

