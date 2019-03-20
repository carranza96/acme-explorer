'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');
  var authController = require('../controllers/authController');

    /** V1: No authentication required */

  /**
   * Get all sponsorships
   *    RequiredRoles: None
   * Post a sponsorship
   *    RequiredRoles: None
	 * Delete all
   *    RequiredRoles: None
   *
	 * @section sponsorships
	 * @type get post delete
	 * @url /v1/sponsorships
   * @param {string} sponsor
  */
  app.route('/v1/sponsorships')
	  .get(sponsorships.list_all_sponsorships)
	  .post(sponsorships.create_a_sponsorship)
    .delete(sponsorships.delete_all_sponsorships);

  /**
   * Put a sponsorship
   *    RequiredRoles: None
   * Get a sponsorship
   *    RequiredRoles: None
   * Delete a sponsorship
   *    RequiredRoles: None
	 *
	 * @section sponsorships
	 * @type get put delete
	 * @url /v1/sponsorships/:sponsorshipId
  */
  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship)
	  .put(sponsorships.update_a_sponsorship)
    .delete(sponsorships.delete_a_sponsorship);



    /** V2: Authentication required */

     /**
   * Get all sponsorships
   *    RequiredRoles: ADMINISTRATOR
   * Post a sponsorship
   *    RequiredRoles: SPONSOR
	 * Delete all
   *    RequiredRoles: ADMINISTRATOR
   *
	 * @section sponsorships
	 * @type get post delete
	 * @url /v2/sponsorships
   * @param {string} sponsor
  */
  app.route('/v2/sponsorships')
  .get(authController.verifyUser(["ADMINISTRATOR","SPONSOR"]), sponsorships.list_all_sponsorships_v2)
  .post(authController.verifyUser(["SPONSOR"]), sponsorships.create_a_sponsorship)
  .delete(authController.verifyUser(["ADMINISTRATOR"]),sponsorships.delete_all_sponsorships);


  /**
   * Put a sponsorship
   *    RequiredRoles: To be the proper SPONSOR
   * Get a sponsorship
   *    RequiredRoles: To be the proper SPONSOR
   * Delete a sponsorship
   *    RequiredRoles: To be the proper SPONSOR
	 *
	 * @section sponsorships
	 * @type get put delete
	 * @url /v2/sponsorships/:sponsorshipId
  */
 app.route('/v2/sponsorships/:sponsorshipId')
 .get(authController.verifyUser(["SPONSOR"]),sponsorships.read_a_sponsorship_v2)
 .put(authController.verifyUser(["SPONSOR"]),sponsorships.update_a_sponsorship_v2)
 .delete(authController.verifyUser(["SPONSOR"]),sponsorships.delete_a_sponsorship_v2);

};
