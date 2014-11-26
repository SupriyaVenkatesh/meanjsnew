'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var accounts = require('../../app/controllers/accounts');
    console.log(accounts);
	// Accounts Routes
	app.route('/accounts')
		.get(accounts.list)
		.post(users.requiresLogin, accounts.create);

	app.route('/accounts/:accountId')
		.get(accounts.read)
		.put(users.requiresLogin, accounts.hasAuthorization, accounts.update)
		.delete(users.requiresLogin, accounts.hasAuthorization, accounts.delete);

	// Finish by binding the Account middleware
	app.param('accountId', accounts.accountByID);
};