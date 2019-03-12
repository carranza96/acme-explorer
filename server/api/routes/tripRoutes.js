'use strict';
module.exports = function(app) {
  var trips = require('../controllers/tripController');
  var authController = require('../controllers/authController');

  /**
   * Get all trips v1
   *    Required role: None
   * Post a trip v1
   *    RequiredRoles: None
	 * Delete all v1
   *    this is just for debugging, it should be removed before production
   *
	 * @section trips
	 * @type get post delete
	 * @url /v1/trips
  */
  app.route('/v1/trips')
	  .get(trips.list_all_trips)
	  .post(trips.create_a_trip)
    .delete(trips.delete_all_trips);


  /**
   * Get all trips v2
   *    Required role: None
   * Post a trip v2
   *    RequiredRoles: MANAGER
	 * Delete all v2
   *    this is just for debugging, it should be removed before production
   *
	 * @section trips
	 * @type get post delete
	 * @url /v1/trips
  */
 app.route('/v2/trips')
 .get(trips.list_all_trips)
 .post(authController.verifyUser(["MANAGER"]),trips.create_a_trip)
 .delete(trips.delete_all_trips);


  /**
   * Search engine for trips
   * Get trips using a single word that must be contained in either the ticker,
   * titles, or descriptions
   *    RequiredRoles: None
   * @section trips
   * @type get
   * @url /v2/trips/search
   * @param {string} startFrom
   * @param {string} pageSize
   * @param {string} sortedBy (category)
   * @param {string} reverse (true|false)
   * @param {string} q //in ticker, title or description
  */
  app.route('/v1/trips/search')
    .get(trips.search_trips)



  /**
   * Get a trip v1
   *    RequiredRoles: None
   *
   * Put a trip v1
   *    RequiredRoles: None
	 * Delete a trip v1
   *    RequiredRoles: None
   *
	 * @section trips
	 * @type get put delete
	 * @url /v1/trips/:tripId
  */
  app.route('/v1/trips/:tripId')
    .get(trips.read_a_trip)
	  .put(trips.update_a_trip)
    .delete(trips.delete_a_trip);

    /**
   * Get a trip v2
   *    RequiredRoles: None
   *
   * Put a trip v2
   *    RequiredRoles: MANAGER
   *
	 * Delete a trip v2
   *    RequiredRoles: MANAGER
   *
	 * @section trips
	 * @type get put delete
	 * @url /v1/trips/:tripId
  */
 app.route('/v2/trips/:tripId')
 .get(trips.read_a_trip)
 .put(authController.verifyUser(["MANAGER"]),trips.update_a_trip)
 .delete(authController.verifyUser(["MANAGER"]),trips.delete_a_trip);


/**
   * Cancel a trip v1
   *    RequiredRoles: None
   *
	 * @section trips
	 * @type put
	 * @url /v1/trips/:tripId/cancel
  */
 app.route('/v1/trips/:tripId/cancel')
 .put(trips.cancel);


 /**
   * Cancel a trip v2
   *    RequiredRoles: MANAGER
   *
	 * @section trips
	 * @type put
	 * @url /v1/trips/:tripId/cancel
  */
<<<<<<< HEAD
 app.route('/v2/trips/:tripId/cancel')
 .put(authController.verifyUser(["MANAGER"]),trips.cancel_a_trip);
=======
 app.route('/v1/trips/:tripId/cancel')
 .put(authController.verifyUser(["MANAGER"]),trips.cancel);
>>>>>>> f5dbad47e3fb373b8e485f5eb16d0bff620a1d0d



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
