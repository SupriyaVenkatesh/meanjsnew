'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var contacts = require('../../app/controllers/contacts');

	// Contacts Routes
	app.route('/contacts')
		.get(contacts.list)
		.post(users.requiresLogin, contacts.create);

	app.route('/contacts/:contactId')
		.get(contacts.read)
		.put(users.requiresLogin, contacts.hasAuthorization, contacts.update)
		.delete(users.requiresLogin, contacts.hasAuthorization, contacts.delete);

	// Finish by binding the Contact middleware
	app.param('contactId', contacts.contactByID);
};