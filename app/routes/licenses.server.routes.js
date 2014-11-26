'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var licenses = require('../../app/controllers/licenses');

	// Licenses Routes
	app.route('/licenses')
		.get(licenses.list)
		.post(licenses.create);

	app.route('/licenses/:licenseId')
		.get(licenses.read)
		.put(users.requiresLogin, licenses.hasAuthorization, licenses.update)
		.delete(users.requiresLogin, licenses.hasAuthorization, licenses.delete);

	// Finish by binding the License middleware
	app.param('licenseId', licenses.licenseByID);
};