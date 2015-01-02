'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contactmetadatum = mongoose.model('Contactmetadatum');

/**
 * Globals
 */
var user, contactmetadatum;

/**
 * Unit tests
 */
describe('Contactmetadatum Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			contactmetadatum = new Contactmetadatum({
				name: 'Contactmetadatum Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return contactmetadatum.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			contactmetadatum.name = '';

			return contactmetadatum.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Contactmetadatum.remove().exec();
		User.remove().exec();

		done();
	});
});