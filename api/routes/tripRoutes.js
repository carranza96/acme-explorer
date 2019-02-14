'use strict';
module.exports = function(app) {
  var trips = require('../controllers/tripController');

  /**
   * Get all trips
   *    Required role: None
   * Post a trip
   *    RequiredRoles: MANAGER
	 * Delete all
   *    this is just for debugging, it should be removed before production
   *
	 * @section trips
	 * @type get post
	 * @url /v1/trips
   * @param {string} search (keyWord contained in the trips' tickers, titles or description)
  */
  app.route('/v1/trips')
	  .get(trips.list_all_trips)
	  .post(trips.create_a_trip)
    .delete(trips.delete_all_trips);

  /**
   * Put a trip
   *    RequiredRoles: MANAGER
   * Get an trip
   *    RequiredRoles: None
	 *
	 * @section trips
	 * @type get put
	 * @url /v1/trips/:tripId
  */
  app.route('/v1/trips/:tripId')
    .get(trips.read_a_trip)
	  .put(trips.update_a_trip)
    .delete(trips.delete_a_trip);

};
