'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Account Schema
 */
var AccountSchema = new Schema({
	firstName__C: {
		type: String,
		default: '',
		required: 'Please fill Account First name',
		trim: true
	},
	lastName__C: {
		type: String,
		default: '',
		required: 'Please fill Account Last name',
		trim: true
	},
	company__C: {
		type: String,
		default: '',
		trim: true
	},
	phone__C: {
		type: String,
		default: '',
		trim: true
	},
	address__C: {
		type: String,
		default: '',
		trim: true
	},
	date__C: {
		type: Date,
		default: Date.now
	},
	country__c: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Account', AccountSchema);