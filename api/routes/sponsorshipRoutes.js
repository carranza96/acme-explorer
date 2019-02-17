'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');

  /**
   * Get all sponsorships
   *    RequiredRoles: None
   * Post a sponsorship
   *    RequiredRoles: SPONSOR
	 * Delete all
   *    RequiredRoles: SPONSOR
   *
	 * @section sponsorships
	 * @type get post delete
	 * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
	  .get(sponsorships.list_all_sponsorships)
	  .post(sponsorships.create_a_sponsorship)
    .delete(sponsorships.delete_all_sponsorships);

  /**
   * Put a sponsorship
   *    RequiredRoles: SPONSOR
   * Get a sponsorship
   *    RequiredRoles: None
   * Delete a sponsorship
   *    RequiredRoles: SPONSOR
	 *
	 * @section sponsorships
	 * @type get put delete
	 * @url /v1/sponsorships/:sponsorshipId
  */
  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship)
	  .put(sponsorships.update_a_sponsorship)
    .delete(sponsorships.delete_a_sponsorship);
};
