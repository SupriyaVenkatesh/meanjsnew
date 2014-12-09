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
	    .post(users.requiresLogin, accounts.create)
		.get(accounts.read)
		.put(users.requiresLogin, accounts.hasAuthorization, accounts.update)
		.delete(users.requiresLogin, accounts.hasAuthorization, accounts.delete);
   app.post('/generateId', accounts.getNextSequence);
	// Finish by binding the Account middleware
	app.param('accountId', accounts.create);
	app.param('accountId', accounts.accountByID);
};