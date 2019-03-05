'use strict';
module.exports = function(app) {
  var config = require('../controllers/configController');

  /**
   * Get the config params
   *    Required role: ADMINISTRATOR
   * Post - Initialize the config params
   *    RequiredRoles: ADMINISTRATOR
   *    Body must be empty
   * Put the config params
   * Delete config params
   *    Body must be empty
   *    this is just for debugging, it should be removed before production
   *
   * @section actors
   * @type get post
   * @url /v1/actors
  */
  app.route('/v1/config')
    .get(config.get_config)
    .post(config.init_config)
    .put(config.update_config)
    .delete(config.delete_config);
};
