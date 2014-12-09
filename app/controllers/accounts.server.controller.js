'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
     customFields = require('mongoose-custom-fields'),
	errorHandler = require('./errors'),
	 multiparty = require('multiparty'),
	Account = mongoose.model('Account'),
	Counter = mongoose.model('Counter'),
    db =  mongoose.connection.db,
	_ = require('lodash');

	
	//to incermentnext values
	exports.getNextSequence = function(req, res) {
	console.log('req',req);
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files) {
				var name = fields.name;
				console.log('name----> ' + name);
			    Counter.findAndModify({ _id:'userid'}, [], { $inc: { next: 1 } }, {}, function (err,response) {
						  if (err) throw err;						
						  console.log('updated',response);
						    res.jsonp(response);
						});
  });
  };
	/**
 * Create a Account
 */
exports.create = function(req, res) {
/* var a = new Counter;
	 a._id= "userid";
	 a.seq = 0;
		a.save(function (err, a) {
		if (err) throw err; 
		console.error('counter is saved');
		//res.jsonp(a);
});*/

	var account = new Account(req.body);
	//account.add({ name: 'string', color: 'string', price: 'number' });
	//account.customField('comments', false);
	account.user = req.user;

	account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Show the current Account
 */
exports.read = function(req, res) {
	res.jsonp(req.account);
};

/**
 * Update a Account
 */
exports.update = function(req, res) {
	var account = req.account ;

	account = _.extend(account , req.body);

	account.save(function(err) {
		if (err) {
		console.log('came to update');
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * Delete an Account
 */
exports.delete = function(req, res) {
	var account = req.account ;

	account.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

/**
 * List of Accounts
 */
exports.list = function(req, res) { Account.find().sort('-created').populate('user', 'displayName').exec(function(err, accounts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(accounts);
		}
	});
};

/**
 * Account middleware
 */
exports.accountByID = function(req, res, next, id) { Account.findById(id).populate('user', 'displayName').exec(function(err, account) {
		if (err) return next(err);
		if (! account) return next(new Error('Failed to load Account ' + id));
		req.account = account ;
		next();
	});
};

/**
 * Account authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.account.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};