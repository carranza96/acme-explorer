'use strict';
module.exports = function(app) {
  var dataWareHouse = require('../controllers/dataWareHouseController');


  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
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
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	app.route('/v1/dataWareHouse/latest')
	.get(dataWareHouse.last_indicator);
};
