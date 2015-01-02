'use strict';

(function() {
	// Contactmetadata Controller Spec
	describe('Contactmetadata Controller Tests', function() {
		// Initialize global variables
		var ContactmetadataController,
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

			// Initialize the Contactmetadata controller.
			ContactmetadataController = $controller('ContactmetadataController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Contactmetadatum object fetched from XHR', inject(function(Contactmetadata) {
			// Create sample Contactmetadatum using the Contactmetadata service
			var sampleContactmetadatum = new Contactmetadata({
				name: 'New Contactmetadatum'
			});

			// Create a sample Contactmetadata array that includes the new Contactmetadatum
			var sampleContactmetadata = [sampleContactmetadatum];

			// Set GET response
			$httpBackend.expectGET('contactmetadata').respond(sampleContactmetadata);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contactmetadata).toEqualData(sampleContactmetadata);
		}));

		it('$scope.findOne() should create an array with one Contactmetadatum object fetched from XHR using a contactmetadatumId URL parameter', inject(function(Contactmetadata) {
			// Define a sample Contactmetadatum object
			var sampleContactmetadatum = new Contactmetadata({
				name: 'New Contactmetadatum'
			});

			// Set the URL parameter
			$stateParams.contactmetadatumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/contactmetadata\/([0-9a-fA-F]{24})$/).respond(sampleContactmetadatum);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contactmetadatum).toEqualData(sampleContactmetadatum);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Contactmetadata) {
			// Create a sample Contactmetadatum object
			var sampleContactmetadatumPostData = new Contactmetadata({
				name: 'New Contactmetadatum'
			});

			// Create a sample Contactmetadatum response
			var sampleContactmetadatumResponse = new Contactmetadata({
				_id: '525cf20451979dea2c000001',
				name: 'New Contactmetadatum'
			});

			// Fixture mock form input values
			scope.name = 'New Contactmetadatum';

			// Set POST response
			$httpBackend.expectPOST('contactmetadata', sampleContactmetadatumPostData).respond(sampleContactmetadatumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Contactmetadatum was created
			expect($location.path()).toBe('/contactmetadata/' + sampleContactmetadatumResponse._id);
		}));

		it('$scope.update() should update a valid Contactmetadatum', inject(function(Contactmetadata) {
			// Define a sample Contactmetadatum put data
			var sampleContactmetadatumPutData = new Contactmetadata({
				_id: '525cf20451979dea2c000001',
				name: 'New Contactmetadatum'
			});

			// Mock Contactmetadatum in scope
			scope.contactmetadatum = sampleContactmetadatumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/contactmetadata\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/contactmetadata/' + sampleContactmetadatumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid contactmetadatumId and remove the Contactmetadatum from the scope', inject(function(Contactmetadata) {
			// Create new Contactmetadatum object
			var sampleContactmetadatum = new Contactmetadata({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Contactmetadata array and include the Contactmetadatum
			scope.contactmetadata = [sampleContactmetadatum];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/contactmetadata\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleContactmetadatum);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.contactmetadata.length).toBe(0);
		}));
	});
}());