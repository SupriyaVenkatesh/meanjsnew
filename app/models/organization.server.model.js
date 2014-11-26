'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organization Schema
 */
var OrganizationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Organization name',
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Please fill Organization email',
		trim: true
	},
	licenses: {
		type: Number,
		default: '',
		required: 'Please fill number of licenses',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Organization', OrganizationSchema);