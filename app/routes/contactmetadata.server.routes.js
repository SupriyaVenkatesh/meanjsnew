'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var contactmetadata = require('../../app/controllers/contactmetadata');

	// Contactmetadata Routes
	app.route('/contactmetadata')
		.get(contactmetadata.list)
		.post(users.requiresLogin, contactmetadata.create);

	app.route('/contactmetadata/:contactmetadatumId')
		.get(contactmetadata.read)
		.put(users.requiresLogin, contactmetadata.hasAuthorization, contactmetadata.update)
		.delete(users.requiresLogin, contactmetadata.hasAuthorization, contactmetadata.delete);

	// Finish by binding the Contactmetadatum middleware
	app.param('contactmetadatumId', contactmetadata.contactmetadatumByID);
};