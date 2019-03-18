'use strict';
module.exports = function(app) {
  var dataWareHouse = require('../controllers/dataWareHouseController');
  var authController = require('../controllers/authController');

/** V1: No authentication required */

  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Any
	 * @section dataWareHouse
	 * @type get post
	 * @url /dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	app.route('/v1/dataWareHouse')
	.get(dataWareHouse.list_all_indicators)
	.post(dataWareHouse.rebuildPeriod)
	.delete(dataWareHouse.delete_all_indicators);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Any
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	app.route('/v1/dataWareHouse/latest')
	.get(dataWareHouse.last_indicator);



/** V2: Authentication required */
/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Any
	 * @section dataWareHouse
	 * @type get post
	 * @url /dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	app.route('/v2/dataWareHouse')
	.get(authController.verifyUser(["ADMINISTRATOR"]),dataWareHouse.list_all_indicators)
	.post(authController.verifyUser(["ADMINISTRATOR"]),dataWareHouse.rebuildPeriod)
	.delete(authController.verifyUser(["ADMINISTRATOR"]),dataWareHouse.delete_all_indicators);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Any
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	app.route('/v2/dataWareHouse/latest')
	.get(authController.verifyUser(["ADMINISTRATOR"]),dataWareHouse.last_indicator);

};
