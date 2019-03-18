'use strict';
module.exports = function(app) {
  var config = require('../controllers/configController');
  var authController = require('../controllers/authController');


/** V1: No authentication required */

  /**
   * Get the config params
   *    Required role: Any
   * Post - Initialize the config params
   *    RequiredRoles: Any
   *    Body must be empty
   * Put the config params
   * Delete config params
   *    Body must be empty
   *    this is just for debugging, it should be removed before production
   *
   * @section config
   * @type get post put
   * @url /v1/actors
  */
  app.route('/v1/config')
    .get(config.get_config)
    .post(config.init_config)
    .put(config.update_config)
    .delete(config.delete_config);



/** V2: Authentication required */

    /**
   * Get the config params
   *    Required role: ADMINISTRATOR
   * Post - Initialize the config params
   *    RequiredRoles: ADMINISTRATOR
   *    Body must be empty
   * Put the config params
   *    RequiredRoles: ADMINISTRATOR
   * Delete config params
   *    RequiredRoles: ADMINISTRATOR
   *    Body must be empty
   *    this is just for debugging, it should be removed before production
   *
   * @section config
   * @type get post put delete
   * @url /v2/config
  */
  app.route('/v2/config')
  .get(authController.verifyUser(["ADMINISTRATOR"]),config.get_config)
  .post(authController.verifyUser(["ADMINISTRATOR"]),config.init_config)
  .put(authController.verifyUser(["ADMINISTRATOR"]),config.update_config)
  .delete(authController.verifyUser(["ADMINISTRATOR"]),config.delete_config);


    
};
