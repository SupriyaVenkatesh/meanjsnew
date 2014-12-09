'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Quote = mongoose.model('Quote'),
	_ = require('lodash');

/**
 * Create a Quote
 */
exports.create = function(req, res) {
	var quote = new Quote(req.body);
	quote.user = req.user;

	quote.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quote);
		}
	});
};

/**
 * Show the current Quote
 */
exports.read = function(req, res) {
	res.jsonp(req.quote);
};

/**
 * Update a Quote
 */
exports.update = function(req, res) {
	var quote = req.quote ;

	quote = _.extend(quote , req.body);

	quote.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quote);
		}
	});
};

/**
 * Delete an Quote
 */
exports.delete = function(req, res) {
	var quote = req.quote ;

	quote.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quote);
		}
	});
};

/**
 * List of Quotes
 */
exports.list = function(req, res) { Quote.find().sort('-created').populate('user', 'displayName').exec(function(err, quotes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quotes);
		}
	});
};

/**
 * Quote middleware
 */
exports.quoteByID = function(req, res, next, id) { Quote.findById(id).populate('user', 'displayName').exec(function(err, quote) {
		if (err) return next(err);
		if (! quote) return next(new Error('Failed to load Quote ' + id));
		req.quote = quote ;
		next();
	});
};

/**
 * Quote authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.quote.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};