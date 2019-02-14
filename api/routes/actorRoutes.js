'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');

  /**
   * Get an actor who is clerk (any role)
   *    Required role: Administrator
   * Post an actor
   *    RequiredRoles: None
   *    validated if customer and not validated if clerk
	 *
	 * @section actors
	 * @type get post
	 * @url /v1/actors
   * @param {string} role (clerk|administrator|customer)
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
	  .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);

  /**
	 * Put to Validate a clerk by actorId
   *    RequiredRole: Administrator
	 *
	 * @section actors
	 * @type put
	 * @url /v1/actors/:actorId/validate
	 * @param {string} actorId
	*/
  app.route('/v1/actors/:actorId/validate')
  .put(actors.validate_an_actor)

};
