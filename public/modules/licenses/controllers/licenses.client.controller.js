'use strict';

angular.module('licenses', []).service('licenseProperties', function (Licenses,$q){
	return {
		create:function(value,callback) {
			var deferred = $q.defer();
			var license = new Licenses ({
				name: value
			});
			
			license.$save(function(response) {
				deferred.resolve(response);
			}, function(errorResponse) {
				deferred.reject();
			});
			var myData = deferred.promise;
			myData.then(function(data) {
				callback(data);
			});
		}
	
	};
});

angular.module('licenses').controller('LicensesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Licenses',
	function($scope, $stateParams, $location, Authentication, Licenses ) {
		$scope.authentication = Authentication;

		// Create new License
		$scope.create = function() {
			// Create new License object
			var license = new Licenses ({
				name: this.name
			});

			// Redirect after save
			license.$save(function(response) {
				$location.path('licenses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing License
		$scope.remove = function( license ) {
			if ( license ) { license.$remove();

				for (var i in $scope.licenses ) {
					if ($scope.licenses [i] === license ) {
						$scope.licenses.splice(i, 1);
					}
				}
			} else {
				$scope.license.$remove(function() {
					$location.path('licenses');
				});
			}
		};

		// Update existing License
		$scope.update = function() {
			var license = $scope.license ;

			license.$update(function() {
				$location.path('licenses/' + license._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Licenses
		$scope.find = function() {
			$scope.licenses = Licenses.query();
		};

		// Find existing License
		$scope.findOne = function() {
			$scope.license = Licenses.get({ 
				licenseId: $stateParams.licenseId
			});
		};
	}
]);