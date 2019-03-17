'use strict';
module.exports = function (app) {
    var applications = require('../controllers/applicationController');
    var authController = require('../controllers/authController');


/** V1: No authentication required */

    /**
     * Get all applications
     *      Required roles: any
     * Post an application
     *      Required roles: any
     * Delete all applications
     *      Required roles: any
     *
     * @section applications
     * @type get post delete
     * @url /v1/applications
     * @param {string} explorer
     * @param {string} manager
     * @param {string} status
     */

    app.route('/v1/applications')
        .get(applications.list_all_applications)
        .post(applications.create_an_application)
        .delete(applications.delete_all_applications);

    
    /**
     * Get all applications of the trips managed by a manager v1
     *      Required roles: any
     *
     * @section applications
     * @type get 
     * @url /v1/applications/manager/:managerId
     * @param {string} status
     */
    app.route('/v1/applications/manager/:managerId')
        .get(applications.list_all_applications_manager)


    /**
     * Get all applications made by an explorer grouped by status v1
     *      Required roles: any
     *
     * @section applications
     * @type get 
     * @url /v1/applications/explorer/:explorerId
     * @param {string} status
     */
    app.route('/v1/applications/explorer/:explorerId')
        .get(applications.list_all_applications_explorer)



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




/** V2: Authentication required */


    /**
     * Get all applications v2
     *      RequiredRoles: 
     *      - ADMINISTRATOR
     *      - To be the proper MANAGER that manages the trips of the applications
     *      - To be the proper EXPLORER that made the applicationes
     * Post an application v2
     *      RequiredRoles: EXPLORER
     * Delete all applications v2
     *      RequiredRoles: ADMINISTRATOR
     *
     * @section applications
     * @type get post delete
     * @url /v2/applications
     * @param {string} status
     */
    app.route('/v2/applications')
        .get(authController.verifyUser(["ADMINISTRATOR","MANAGER","EXPLORER"]), applications.list_all_applications_v2)
        .post(authController.verifyUser(["EXPLORER"]), applications.create_an_application)
        .delete(authController.verifyUser(["ADMINISTRATOR"]), applications.delete_all_applications);



    /**
     * Get all applications of the trips managed by a manager v2
     *      Required roles: MANAGER that manages the trips of the applications
     *
     * @section applications
     * @type get 
     * @url /v1/applications/manager/:managerId
     * @param {string} status
     */
    app.route('/v2/applications/manager/:managerId')
        .get(authController.verifyUser(["MANAGER"]), applications.list_all_applications_manager_v2)


     /**
     * Get all applications made by an explorer grouped by status v2
     *      Required roles: EXPLORER that has made the applications
     *
     * @section applications
     * @type get 
     * @url /v1/applications/explorer/:explorerId
     * @param {string} status
     */
    app.route('/v2/applications/explorer/:explorerId')
        .get(authController.verifyUser(["EXPLORER"]), applications.list_all_applications_explorer_v2)


};
