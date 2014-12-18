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
		message: 'Account Name should be between 3 and 50 characters'
	  }),
	  validate({
		validator: 'isAlphanumeric',
		passIfEmpty: true,
		message: 'Account Name should contain alpha-numeric characters only'
	  })
];
	
/**
 * Account Schema
 */
var AccountSchema = new Schema({
     accountOwner__C: {
		type: String,
		default: '',
		required: 'Please fill Account First name',
		trim: true,
	},
	accountName__C: {
		type: String,
		default: '',
		required: 'Please fill Account Name',
		trim: true,
		validate: nameValidator
	},
	rating__C: {
		type: String,
		default: '',
		trim: true
	},
	phone__C: {
		type: String,
		default: '',
		trim: true
	},
	pAccount__C: {
		type: String,
		default: '',
		trim: true
	},
	fax__C: {
		type: String,
		default: '',
		trim: true
	},
	accountNumber__C: {
		type: String,
		default: '',
		trim: true
	},
	website__C: {
		type: String,
		default: '',
		trim: true
	},
	accountSite__C: {
		type: String,
		default: '',
		trim: true
	},
	type__C: {
		type: String,
		default: '',
		trim: true
	},
	annualRevenue__C: {
		type: Number,
		default: '',
		trim: true
	},
	ownership__C: {
		type: String,
		default: '',
		trim: true
	},
	employees__C: {
		type: Number,
		default: '',
		trim: true
	},
	industry__C: {
		type: String,
		default: '',
		trim: true
	},
	Baddress: { 
	   Country_C: String, 
	   Street_C: String,
	   City_C: String,
	   State_C: String,
	   ZipCode_C: String
     },
	Saddress: { 
	   Country_C: String, 
	   Street_C: String,
	   City_C: String,
	   State_C: String,
	   ZipCode_C: String
     },
	
	Description_C: {
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