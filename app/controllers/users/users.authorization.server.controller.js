'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

	var ObjectId = require('mongoose').Types.ObjectId; 
    //var query222 = { orgId: new ObjectId($scope.authentication.user.orgId) };
/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};
exports.userByOrgID = function(req, res, next, orgid) {
console.log('came inside userByOrgID');
  console.log(' inside orgId ', orgId);
   User.find({
		orgId : new ObjectId(orgid)
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + orgid));
		req.profile = user;
		next();
	});
};

exports.userOnly = function(req, res) {
	User.findOne({
		orgId2 : $scope.authentication.user.orgId
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * List of Users
 */
exports.list = function(req, res) {
	//console.log('orgId--->'+req.user.orgId,{role:'user',orgId: req.user.orgId})
 User.find().sort('-created').populate('user', 'displayName').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};


/**
 * Require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
  */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};
