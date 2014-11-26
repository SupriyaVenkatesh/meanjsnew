'use strict';

(function() {
	// Licenses Controller Spec
	describe('Licenses Controller Tests', function() {
		// Initialize global variables
		var LicensesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Licenses controller.
			LicensesController = $controller('LicensesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one License object fetched from XHR', inject(function(Licenses) {
			// Create sample License using the Licenses service
			var sampleLicense = new Licenses({
				name: 'New License'
			});

			// Create a sample Licenses array that includes the new License
			var sampleLicenses = [sampleLicense];

			// Set GET response
			$httpBackend.expectGET('licenses').respond(sampleLicenses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.licenses).toEqualData(sampleLicenses);
		}));

		it('$scope.findOne() should create an array with one License object fetched from XHR using a licenseId URL parameter', inject(function(Licenses) {
			// Define a sample License object
			var sampleLicense = new Licenses({
				name: 'New License'
			});

			// Set the URL parameter
			$stateParams.licenseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/licenses\/([0-9a-fA-F]{24})$/).respond(sampleLicense);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.license).toEqualData(sampleLicense);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Licenses) {
			// Create a sample License object
			var sampleLicensePostData = new Licenses({
				name: 'New License'
			});

			// Create a sample License response
			var sampleLicenseResponse = new Licenses({
				_id: '525cf20451979dea2c000001',
				name: 'New License'
			});

			// Fixture mock form input values
			scope.name = 'New License';

			// Set POST response
			$httpBackend.expectPOST('licenses', sampleLicensePostData).respond(sampleLicenseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the License was created
			expect($location.path()).toBe('/licenses/' + sampleLicenseResponse._id);
		}));

		it('$scope.update() should update a valid License', inject(function(Licenses) {
			// Define a sample License put data
			var sampleLicensePutData = new Licenses({
				_id: '525cf20451979dea2c000001',
				name: 'New License'
			});

			// Mock License in scope
			scope.license = sampleLicensePutData;

			// Set PUT response
			$httpBackend.expectPUT(/licenses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/licenses/' + sampleLicensePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid licenseId and remove the License from the scope', inject(function(Licenses) {
			// Create new License object
			var sampleLicense = new Licenses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Licenses array and include the License
			scope.licenses = [sampleLicense];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/licenses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLicense);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.licenses.length).toBe(0);
		}));
	});
}());