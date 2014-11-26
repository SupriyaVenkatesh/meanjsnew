'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * License Schema
 */
var LicenseSchema = new Schema({
	name: {
		type: Number
		
	},
	created: {
		type: Date,
		default: Date.now
	}
	
});

mongoose.model('License', LicenseSchema);