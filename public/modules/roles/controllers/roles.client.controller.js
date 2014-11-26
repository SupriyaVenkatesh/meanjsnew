'use strict';
var app=angular.module('roles', [] );
app.service('rolesProperties', function (Roles){
	var RolesList = Roles.query();
	 return {
    all: function() {
      return RolesList;
    },
    first: function() {
      return RolesList[0];
    }
  };
});

app.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});

app.controller('RolesCreateController', ['$scope', '$stateParams', '$location', 'Roles',
	function($scope, $stateParams, $location, Roles ) {
     $scope.create = function() {
			// Create new Role object
			//this.name=this.name.toUpperCase()
			var role = new Roles ({
				name: this.name
			});
			// Redirect after save
			role.$save(function(response) {
				// Clear form fields
				$scope.name = '';
				alert("Role is Created");
				$location.path('/superadminindexpage'); 
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
app.controller('RolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Roles',
	function($scope, $stateParams, $location, Authentication, Roles ) {
		//$scope.authentication = Authentication;

		// Create new Role
		$scope.create = function() {
			// Create new Role object
			var role = new Roles ({
				name: this.name
			});

			// Redirect after save
			role.$save(function(response) {
				$location.path('roles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Role
		$scope.remove = function( role ) {
			if ( role ) { role.$remove();

				for (var i in $scope.roles ) {
					if ($scope.roles [i] === role ) {
						$scope.roles.splice(i, 1);
					}
				}
			} else {
				$scope.role.$remove(function() {
					$location.path('roles');
				});
			}
		};

		// Update existing Role
		$scope.update = function() {
			var role = $scope.role ;

			role.$update(function() {
				$location.path('roles/' + role._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Roles
		$scope.find = function() {
			$scope.roles = Roles.query();
		};

		// Find existing Role
		$scope.findOne = function() {
			$scope.role = Roles.get({ 
				roleId: $stateParams.roleId
			});
		};
	}
]);