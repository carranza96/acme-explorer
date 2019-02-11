'use strict';
module.exports = function(app) {
  var items = require('../controllers/itemController');

  /**
   * Manage catalogue of items: 
   * Post items
   *    RequiredRoles: Administrator
   * Get items 
   *    RequiredRoles: Administrator
   *
   * @section items
   * @type put 
   * @url /v1/items
  */
  app.route('/v1/items')
		.get(items.list_all_items)
    .post(items.create_an_item);

  /**
   * Put comments on an item or update it
   *    RequiredRoles: any (comment); administrator if any other update
   * Delete an item
   *    RequiredRoles: Administrator
   * Get an item
   *    RequiredRoles: any
   * 
   * @section items
   * @type get put delete 
   * @url /v1/items/:itemId
  */
  app.route('/v1/items/:itemId')
    .get(items.read_an_item)
	  .put(items.update_an_item)
    .delete(items.delete_an_item);
  
  /**
   * get results from a search of items groupBy category
   *    RequiredRoles: None
   * 
   * @section items
	 * @type get
	 * @url /v1/items/search
   * @param {string} sortedBy (category)
   * @param {string} keyword //in sku, name, or description
   */
  app.route('/v1/items/search')
		.get(items.search_items)

  app.route('/v0/categories')
    .get(items.list_all_categories)
    .post(items.create_a_category);

  app.route('/v0/categories/:categId')
    //.get(items.read_a_category)
    //.put(items.update_a_category)
    //.delete(items.delete_a_category);
};
