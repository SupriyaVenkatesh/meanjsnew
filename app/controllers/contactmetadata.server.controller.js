'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Contactmetadatum = mongoose.model('Contactmetadatum'),
	_ = require('lodash');

/**
 * Create a Contactmetadatum
 */
exports.create = function(req, res) {
	var contactmetadatum = new Contactmetadatum(req.body);
	contactmetadatum.user = req.user;

	contactmetadatum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactmetadatum);
		}
	});
};

/**
 * Show the current Contactmetadatum
 */
exports.read = function(req, res) {
	res.jsonp(req.contactmetadatum);
};

/**
 * Update a Contactmetadatum
 */
exports.update = function(req, res) {
	var contactmetadatum = req.contactmetadatum ;

	contactmetadatum = _.extend(contactmetadatum , req.body);

	contactmetadatum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactmetadatum);
		}
	});
};

/**
 * Delete an Contactmetadatum
 */
exports.delete = function(req, res) {
	var contactmetadatum = req.contactmetadatum ;

	contactmetadatum.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactmetadatum);
		}
	});
};

/**
 * List of Contactmetadata
 */
exports.list = function(req, res) { Contactmetadatum.find().sort('-created').populate('user', 'displayName').exec(function(err, contactmetadata) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contactmetadata);
		}
	});
};

/**
 * Contactmetadatum middleware
 */
exports.contactmetadatumByID = function(req, res, next, id) { Contactmetadatum.findById(id).populate('user', 'displayName').exec(function(err, contactmetadatum) {
		if (err) return next(err);
		if (! contactmetadatum) return next(new Error('Failed to load Contactmetadatum ' + id));
		req.contactmetadatum = contactmetadatum ;
		next();
	});
};

/**
 * Contactmetadatum authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.contactmetadatum.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};