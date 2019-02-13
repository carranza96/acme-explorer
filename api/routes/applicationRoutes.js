'use strict';
module.exports = function (app) {
    var applications = require('../controllers/applicationController');

    /**
     * Get all applications
     * Post an application
     *
     * @section applications
     * @type get post
     * @url /v1/applications
     * @param {string} role (clerk|administrator|customer)
     */
    app.route('/v1/applications')
        .get(applications.list_all_applications)
        .post(applications.create_an_application);

    /**
     * Put an application
     * Get an application
     * Delete an application
     *
     * @section applications
     * @type get put delete
     * @url /v1/applications/:applicationId
     */
    app.route('/v1/applications/:applicationId')
        .get(applications.read_an_application)
        .put(applications.update_an_application)
        .delete(applications.delete_an_application);

};