'use strict';
module.exports = function(app) {
  var finders = require('../controllers/finderController');

  /**
   * Get all finders
   *    RequiredRoles: ADMINISTRATOR
   * Post a finder
   *    RequiredRoles: EXPLORER
	 * Delete all
   *    RequiredRoles: ADMINISTRATOR
   *
	 * @section finders
	 * @type get post delete
	 * @url /v1/finders
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
};
