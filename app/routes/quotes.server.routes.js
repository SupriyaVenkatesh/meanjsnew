'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var quotes = require('../../app/controllers/quotes');

	// Quotes Routes
	app.route('/quotes')
		.get(quotes.list)
		.post(users.requiresLogin, quotes.create);

	app.route('/quotes/:quoteId')
		.get(quotes.read)
		.put(users.requiresLogin, quotes.hasAuthorization, quotes.update)
		.delete(users.requiresLogin, quotes.hasAuthorization, quotes.delete);

	// Finish by binding the Quote middleware
	app.param('quoteId', quotes.quoteByID);
};