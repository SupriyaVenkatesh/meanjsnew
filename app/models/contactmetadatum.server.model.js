'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contactmetadatum Schema
 */
var ContactmetadatumSchema = new Schema({
	type: {
		type: String,
		default: '',
		required: 'Please fill Field type',
		trim: true
	},
	caption: {
		type: String,
		default: '',
		required: 'Please fill Field Label',
		trim: true
	},
	section: {
		type: String,
	},
	model: {
		type: String,
	},
	orgId: {
		type: Schema.ObjectId,
		ref: 'Organization'
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

mongoose.model('Contactmetadatum', ContactmetadatumSchema);