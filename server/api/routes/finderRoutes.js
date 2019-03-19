'use strict';
module.exports = function(app) {
  var finders = require('../controllers/finderController');
  var authController = require('../controllers/authController');

  /** V1: No authentication required */


  /**
   * Get all finders
   *    RequiredRoles: Any
   * Post a finder
   *    RequiredRoles: Any
	 * Delete all
   *    RequiredRoles: Any
   *
	 * @section finders
	 * @type get post delete
	 * @url /v1/finders
   * @param {string} explorer
  */
  app.route('/v1/finders')
	  .get(finders.list_all_finders)
	  .post(finders.create_a_finder)
    .delete(finders.delete_all_finders);

    
  /**
   * Put a finder
   *    RequiredRoles: EXPLORER
   * Get a finder
   *    RequiredRoles: EXPLORER
   * Delete a finder
   *    RequiredRoles: EXPLORER
	 *
	 * @section finders
	 * @type get put delete
	 * @url /v1/finders/:finderId
  */
  app.route('/v1/finders/:finderId')
    .get(finders.read_a_finder)
	  .put(finders.update_a_finder)
    .delete(finders.delete_a_finder);



    /** V2: Authentication required */

    /**
   * Get all finders
   *    RequiredRoles: 
   *        - ADMINISTRATOR
   *        - To be the proper EXPLORER
   * Post a finder
   *    RequiredRoles:  EXPLORER
	 * Delete all
   *    RequiredRoles: ADMINISTRATOR
   *
	 * @section finders
	 * @type get post delete
	 * @url /v2/finders
   * @param {string} explorer
  */
  app.route('/v2/finders')
  .get(authController.verifyUser(["ADMINISTRATOR","EXPLORER"]),finders.list_all_finders_v2)
  .post(authController.verifyUser(["EXPLORER"]),finders.create_a_finder)
  .delete(authController.verifyUser(["ADMINISTRATOR"]),finders.delete_all_finders);



    /**
   * Put a finder
   *    RequiredRoles: To be the proper EXPLORER
   * Get a finder
   *    RequiredRoles: To be the proper EXPLORER
   * Delete a finder
   *    RequiredRoles: To be the proper EXPLORER
	 *
	 * @section finders
	 * @type get put delete
	 * @url /v2/finders/:finderId
  */
 
 app.route('/v2/finders/:finderId')
 .get(authController.verifyUser(["EXPLORER"]),finders.read_a_finder_v2)
 .put(authController.verifyUser(["EXPLORER"]),finders.update_a_finder_v2)
 .delete(authController.verifyUser(["EXPLORER"]),finders.delete_a_finder_v2);

};
