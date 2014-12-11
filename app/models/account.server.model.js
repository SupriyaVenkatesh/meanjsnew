'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
   validate = require('mongoose-validator'),
	Schema = mongoose.Schema;


var nameValidator = [
	  validate({
		validator: 'isLength',
		arguments: [3, 50],
		message: 'Name should be between 3 and 50 characters'
	  }),
	  validate({
		validator: 'isAlphanumeric',
		passIfEmpty: true,
		message: 'Name should contain alpha-numeric characters only'
	  })
];
	
/**
 * Account Schema
 */
var AccountSchema = new Schema({
	firstName__C: {
		type: String,
		default: '',
		required: 'Please fill Account First name',
		trim: true,
		validate: nameValidator
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