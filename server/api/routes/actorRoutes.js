'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');
  var authController = require('../controllers/authController');

  /**
   * Get all actors by role
   *    Required role: Administrator
   * Post an actor
   *    RequiredRoles: None
   *    validated if explorer or sponsor and not validated if clerk
	 * Delete all
   *    this is just for debugging, it should be removed before production
   *
	 * @section actors
	 * @type get post
	 * @url /v1/actors
   * @param {string} role (EXPLORER|ADMINISTRATOR|MANAGER|SPONSOR)
  */
  app.route('/v1/actors')
	  .get(actors.list_all_actors)
	  .post(actors.create_an_actor)
    .delete(actors.delete_all_actors);

  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
  */
  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
	  .put(actors.update_an_actor_v1)
    .delete(actors.delete_an_actor);


  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: any
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
  */  
 app.route('/v2/actors/:actorId')
 .get(actors.read_an_actor)
 .put(authController.verifyUser(["ADMINISTRATOR","EXPLORER","MANAGER"])
 ,actors.update_an_actor_v2) //Consumer y clerk no puede modificar la info de otro consumer/clerk



  /**
	 * Ban an actor by actorId
   *    RequiredRole: Administrator
	 *
	 * @section actors
	 * @type put
	 * @url /v1/actors/:actorId/ban
	 * @param {string} actorId
	*/
  app.route('/v1/actors/:actorId/ban')
  .put(actors.ban_an_actor)
  /**
   * Unban an actor by actorId
   *    RequiredRole: Administrator
   *
   * @section actors
   * @type put
   * @url /v1/actors/:actorId/unban
   * @param {string} actorId
  */
  app.route('/v1/actors/:actorId/unban')
  .put(actors.unban_an_actor)

};
