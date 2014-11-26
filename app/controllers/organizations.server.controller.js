'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    formidable = require('formidable'),
	errorHandler = require('./errors'),
	Organization = mongoose.model('Organization'),
	uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    fs = require('fs'),
	mkpath = require('mkpath'),
	_ = require('lodash');

/**
 * Create a Organization
 */
exports.create = function(req, res) {
	var organization = new Organization(req.body);
	//organization.user = req.user;

	organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organization);
		}
	});
};

/**
 * Show the current Organization
 */
exports.read = function(req, res) {
	res.jsonp(req.organization);
};

/**
 * Update a Organization
 */
exports.update = function(req, res) {
	var organization = req.organization ;

	organization = _.extend(organization , req.body);

	organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organization);
		}
	});
};

/**
 * Delete an Organization
 */
exports.delete = function(req, res) {
	var organization = req.organization ;

	organization.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organization);
		}
	});
};

/**
 * List of Organizations
 */
exports.list = function(req, res) { Organization.find().sort('-created').populate('user', 'displayName').exec(function(err, organizations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organizations);
		}
	});
};

exports.postImage = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
	console.log('files.file ' , files.file);
	Object.keys(files).forEach(function(name) {
		console.log('got file named ' + name);
     });
	 	var folderName = fields.name;
		mkpath('public/modules/users/img/'+ folderName, function (err) {
			if (err) throw err;
			console.log('Directory structure is created');
		});
		
		//console.log('files.file[0] : ' ,files.file[0]);
		//console.log('files.file[1] : ' ,files.file[1]);
              if (typeof files.file == 'undefined'){
					var file = files.dropfile[0];
			   }else {
			           var file = files.file[0];
                     } 
		//var file = files.dropfile[0];	
		var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
        // uuid is for generating unique filenames. 
        var fileName = folderName+ '_logo' + extension;
		var destPath = 'public/modules/users/img/'+ folderName+ '/' + fileName;
		console.log('destPath:' + destPath);
        // Server side file type checker.
        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }

        fs.rename(tmpPath, destPath, function(err) {
            if (err) {
                return res.status(400).send('Image is not saved:');
            }
            return res.json(destPath);
        });
    });
};

/**
 * Organization middleware
 */
exports.organizationByID = function(req, res, next, id) { Organization.findById(id).populate('user', 'displayName').exec(function(err, organization) {
		if (err) return next(err);
		if (! organization) return next(new Error('Failed to load Organization ' + id));
		req.organization = organization ;
		next();
	});
};

/**
 * Organization authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.organization.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};