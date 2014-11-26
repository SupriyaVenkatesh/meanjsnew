'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	License = mongoose.model('License'),
	_ = require('lodash');

/**
 * Create a License
 */
exports.create = function(req, res) {
	var license = new License(req.body);
	license.user = req.user;

	license.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(license);
		}
	});
};

/**
 * Show the current License
 */
exports.read = function(req, res) {
	res.jsonp(req.license);
};

/**
 * Update a License
 */
exports.update = function(req, res) {
	var license = req.license ;

	license = _.extend(license , req.body);

	license.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(license);
		}
	});
};

/**
 * Delete an License
 */
exports.delete = function(req, res) {
	var license = req.license ;

	license.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(license);
		}
	});
};

/**
 * List of Licenses
 */
exports.list = function(req, res) { License.find().sort('-created').populate('user', 'displayName').exec(function(err, licenses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(licenses);
		}
	});
};

/**
 * License middleware
 */
exports.licenseByID = function(req, res, next, id) { License.findById(id).populate('user', 'displayName').exec(function(err, license) {
		if (err) return next(err);
		if (! license) return next(new Error('Failed to load License ' + id));
		req.license = license ;
		next();
	});
};

/**
 * License authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.license.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};