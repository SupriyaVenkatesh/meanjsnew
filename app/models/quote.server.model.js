'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Quote Schema
 */
var QuoteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Quote name',
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

mongoose.model('Quote', QuoteSchema);