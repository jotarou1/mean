'use strict';


module.exports = function(Events, app, auth, database) {

    var registration = require('../controllers/registration');

    app.route('/events/register/')
        .post(auth.requiresLogin, registration.registerForEvent);

    app.route('/events/register/complete')
        .get(auth.requiresLogin, registration.completeRegistration);

    app.route('/events/register/cancel')
        .get(auth.requiresLogin, registration.cancelRegistration);
};