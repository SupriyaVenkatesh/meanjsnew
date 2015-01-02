'use strict';

// Contactmetadata controller
angular.module('contactmetadata').controller('ContactmetadataController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contactmetadata',
	function($scope, $stateParams, $location, Authentication, Contactmetadata ) {
		$scope.authentication = Authentication;
		$scope.contactmetadata = Contactmetadata.query();

		// Create new Contactmetadatum
		$scope.create = function() {
			// Create new Contactmetadatum object
			var contactmetadatum = new Contactmetadata ({
				type: this.type,
				model: this.caption + '_C',
				section: "Work",
				caption: this.caption,
				orgId : $scope.authentication.user.orgId
			});

			// Redirect after save
			contactmetadatum.$save(function(response) {
			console.log('$scope.contactmetadata',$scope.contactmetadata);
				//$location.path('contactmetadata/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contactmetadatum
		$scope.remove = function( contactmetadatum ) {
			if ( contactmetadatum ) { contactmetadatum.$remove();

				for (var i in $scope.contactmetadata ) {
					if ($scope.contactmetadata [i] === contactmetadatum ) {
						$scope.contactmetadata.splice(i, 1);
					}
				}
			} else {
				$scope.contactmetadatum.$remove(function() {
					$location.path('contactmetadata');
				});
			}
		};

		// Update existing Contactmetadatum
		$scope.update = function() {
			var contactmetadatum = $scope.contactmetadatum ;

			contactmetadatum.$update(function() {
				$location.path('contactmetadata/' + contactmetadatum._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contactmetadata
		$scope.find = function() {
			$scope.contactmetadata = Contactmetadata.query();
		};

		// Find existing Contactmetadatum
		$scope.findOne = function() {
			$scope.contactmetadatum = Contactmetadata.get({ 
				contactmetadatumId: $stateParams.contactmetadatumId
			});
		};
	}
]);