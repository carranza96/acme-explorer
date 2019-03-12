'use strict';
module.exports = function (app) {
    var applications = require('../controllers/applicationController');
    var authController = require('../controllers/authController');

    /**
     * Get all applications
     * Post an application
     * Delete all applications
     *
     * @section applications
     * @type get post delete
     * @url /v1/applications
     * @param {string} status
     */
    app.route('/v1/applications')
        .get(applications.list_all_applications)
        .post(applications.create_an_application)
        .delete(applications.delete_all_applications);
    /**
     *
     * Post an application (Apply for a trip)
     * Required Role: Explorer
     *
     * @section applications
     * @type post
     * @url /v2/applications
     *
     */
    app.route('/v2/applications')
        .post(authController.verifyUser(["EXPLORER"]),applications.create_an_application);

    /**
     * Put an application
     * Get an application
     * Delete an application
     *
     * @section applications
     * @type get put delete
     * @url /v1/applications/:applicationId
     */
    app.route('/v1/applications/:applicationId/')
        .get(applications.read_an_application)
        .put(applications.update_an_application)
        .delete(applications.delete_an_application);


    /**
     * Change status of an application (from pending to due or rejected)
     *
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId
     */
    app.route('/v1/applications/:applicationId/changeStatus')
        .put(applications.change_status_application);

    /**
     * Change status of an application (from pending to due or rejected)
     * Required Role: MANAGER
     *
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId
     */
    app.route('/v2/applications/:applicationId/changeStatus')
        .put(authController.verifyUser(["MANAGER"]),applications.change_status_application);

    /**
     * Pay a trip fee (status from due to accepted and paid = true)
     *
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId
     */
    app.route('/v1/applications/:applicationId/pay')
        .put(applications.pay_application);

    /**
     * Pay a trip fee (status from due to accepted and paid = true)
     * Required Role: Explorer
     *
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId
     */
    app.route('/v2/applications/:applicationId/pay')
        .put(authController.verifyUser(["EXPLORER"]),applications.pay_application);

    /**
     * Cancel an application (status from accepted to cancelled)
     *
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId
     */
    app.route('/v1/applications/:applicationId/cancel')
        .put(applications.cancel_application);

    /**
     * Cancel an application (status from accepted to cancelled)
     * Required Role: Explorer
     *
     * @section applications
     * @type put
     * @url /v1/applications/:applicationId
     */
    app.route('/v2/applications/:applicationId/cancel')
        .put(authController.verifyUser(["EXPLORER"]),applications.cancel_application);

};
