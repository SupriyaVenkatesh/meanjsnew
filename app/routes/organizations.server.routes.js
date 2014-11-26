'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var organizations = require('../../app/controllers/organizations');

	// Organizations Routes
	app.route('/organizations')
		.get(organizations.list)
		.post(organizations.create);

	app.route('/organizations/:organizationId')
		.get(organizations.read)
		.put(users.requiresLogin, organizations.hasAuthorization, organizations.update)
		.delete(users.requiresLogin, organizations.hasAuthorization, organizations.delete);
		
    app.post('/upload', organizations.postImage);  
	app.post('/uploadnew', organizations.postImage);

	// Finish by binding the Organization middleware
	app.param('organizationId', organizations.organizationByID);
};