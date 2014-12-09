'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    customFields = require('mongoose-custom-fields');

/**
 * Account Schema
 */
var AccountSchema = new Schema({
     _id: {
		type: String
	},
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
/**
 * counters Schema
 */
var counterSchema = new Schema({
  _id: {
		type: String
	},
   next: { 
      type: Number
     }
});

counterSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

mongoose.model('Counter', counterSchema);
//AccountSchema.plugin(customFields);
mongoose.model('Account', AccountSchema);