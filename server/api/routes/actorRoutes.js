'use strict';
module.exports = function (app) {
  var actors = require('../controllers/actorController');
  var authController = require('../controllers/authController');

  /** V1: No authentication required */

  /** 
   * Get all actors by role
   *    Required role: None
   * Post an actor
   *    RequiredRoles: None
	 * Delete all
   *    this is just for debugging, it should be removed before production
   *
	 * @section actors
	 * @type get post delete
	 * @url /v1/actors
   * @param {string} role (EXPLORER|SPONSOR|MANAGER|ADMINISTRATOR)
  */
  app.route('/v1/actors')
    .get(actors.list_all_actors)
    .post(actors.create_an_actor)
    .delete(actors.delete_all_actors);

  /**
  *  Compute a cube M(e,p) for a
  *  given explorerId e and a given period p concerning
  *  the money spend by such actor in trips during such period.
  *  RequiredRole: None
  *
  * @section actors
  * @type get
  * @url /v1/actors/computeCube
  * @param {string} explorerId
  * @param {string} period
  * @param {string} money
  * @param {string} operator
 */
  app.route('/v1/actors/computeCube')
    .get(actors.compute_cube);




  /**
   * Create a manager
   *    RequiredRoles: None
	 * @section actors
	 * @type  post
	 * @url /v1/actors/managers
   *
  */
  app.route('/v1/actors/manager')
    .post(actors.create_a_manager)


  /**
   * Create an admin
   *    RequiredRoles: None
	 * @section actors
	 * @type  post
	 * @url /v1/actors/administrator
   *
  */
  app.route('/v1/actors/administrator')
    .post(actors.create_an_admin)


  /**
   * Put an actor
   *    RequiredRoles: any
   * Get an actor
   *    RequiredRoles: any
   * Delete an actor
   *    RequiredRoles: any
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
  */
  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);


  /**
	 * Ban an actor by actorId
   *    RequiredRole: None
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
   *    RequiredRole: None
   *
   * @section actors
   * @type put
   * @url /v1/actors/:actorId/unban
   * @param {string} actorId
  */
  app.route('/v1/actors/:actorId/unban')
    .put(actors.unban_an_actor)

  /** V2: Authentication required */


  /** 
  * Get all actors by role
  *    Required role: Administrator
  * Post an actor with role explorer/sponsor
  *    RequiredRoles: None
  * Delete all
  *    Required role: Administrator
  *
  * @section actors
  * @type get post delete
  * @url /v2/actors
  * @param {string} role (EXPLORER|SPONSOR|MANAGER|ADMINISTRATOR)
 */
  app.route('/v2/actors')
    .get(authController.verifyUser(["ADMINISTRATOR"]), actors.list_all_actors)
    .post(actors.create_an_actor)
    .delete(authController.verifyUser(["ADMINISTRATOR"]), actors.delete_all_actors);



  /**
  * Create a manager
  *    RequiredRoles: ADMINISTRATOR
  * @section actors
  * @type  post
  * @url /v2/actors/manager
  *
 */
  app.route('/v2/actors/manager')
    .post(authController.verifyUser(["ADMINISTRATOR"]), actors.create_a_manager)



  /**
  * Create an admin
  *    RequiredRoles: ADMINISTRATOR
  * @section actors
  * @type  post
  * @url /v2/actors/administrator
  *
 */
  app.route('/v2/actors/administrator')
    .post(authController.verifyUser(["ADMINISTRATOR"]), actors.create_an_admin)



  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
   * Delete an actor
   *    RequiredRoles: Administrator
   *
   * @section actors
   * @type get put
   * @url /v2/actors/:actorId
  */
  app.route('/v2/actors/:actorId')
    .get(authController.verifyUser(["ADMINISTRATOR", "EXPLORER", "MANAGER", "SPONSOR"]), actors.read_an_actor_v2)
    .put(authController.verifyUser(["ADMINISTRATOR", "EXPLORER", "MANAGER", "SPONSOR"])
      , actors.update_an_actor_v2) //Manager, Explorer, Sponsor no puede modificar la info de otro Manager/Explorer/Sponsor
    .delete(authController.verifyUser(["ADMINISTRATOR"]), actors.delete_an_actor);


  /**
  * Ban an actor by actorId
  *    RequiredRole: Administrator
  *
  * @section actors
  * @type put
  * @url /v2/actors/:actorId/ban
  * @param {string} actorId
 */
  app.route('/v2/actors/:actorId/ban')
    .put(authController.verifyUser(["ADMINISTRATOR"]), actors.ban_an_actor)

  /**
   * Unban an actor by actorId
   *    RequiredRole: Administrator
   *
   * @section actors
   * @type put
   * @url /v2/actors/:actorId/unban
   * @param {string} actorId
  */
  app.route('/v2/actors/:actorId/unban')
    .put(authController.verifyUser(["ADMINISTRATOR"]), actors.unban_an_actor)


};


