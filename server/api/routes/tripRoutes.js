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
  */
  app.route('/v1/trips')
	  .get(trips.list_all_trips)
	  .post(trips.create_a_trip)
    .delete(trips.delete_all_trips);

  /**
   * Search engine for trips
   * Get trips using a single word that must be contained in either the ticker,
   * titles, or descriptions
   *    RequiredRoles: None
   * @section trips
   * @type get
   * @url /v1/trips/search
   * @param {string} startFrom
   * @param {string} pageSize
   * @param {string} sortedBy (category)
   * @param {string} reverse (true|false)
   * @param {string} q //in ticker, title or description
  */
  app.route('/v1/trips/search')
    .get(trips.search_trips)



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

  /**
   * Put a stage
   *    RequiredRoles: MANAGER
   *
	 * @section trips
	 * @type get put
	 * @url /v1/trips/:tripId/addStage
  */
  app.route('/v1/trips/:tripId/addStage')
      .put(trips.add_stage);
  /**
   * Cancel a trip
   *    RequiredRoles: MANAGER
   *
   * @section trips
   * @type get put
   * @url /v1/trips/:tripId/cancel
  */
  app.route('/v1/trips/:tripId/cancel')
      .put(trips.cancel);





};