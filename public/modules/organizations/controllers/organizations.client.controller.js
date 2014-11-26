'use strict';
var app = angular.module('organizations',['angularFileUpload']);
app.service('sharedProperties', function (Organizations,$q){
  var OrganizationsList = Organizations.query();
	return {
		create:function(value,callback) {
			var deferred = $q.defer();
			var organization = new Organizations ({
				name: value
			});
			
			organization.$save(function(response) {
				deferred.resolve(response);
			}, function(errorResponse) {
				deferred.reject();
			});
			var myData = deferred.promise;
			myData.then(function(data) {
				callback(data);
			});
		},
	    orgLength:function() {
		   return OrganizationsList; 
		}
	};
});
	app.directive('file', function () {
			return {
				$scope: {
					file: '='
				},
				link: function ($scope, el, attrs) {
					el.bind('change', function (event) {
						var file = event.target.files[0];
						$scope.file =(event.srcElement || event.target).files[0];
						$scope.$apply();
						 $scope.getFile();
					});
				}
			};
	});


app.factory('fileReader', ['$q', '$log',  function($q, $log) {
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
        };
}]);	
	
app.controller('OrganizationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organizations','$http','$upload','fileReader',
	function($scope, $stateParams, $location, Authentication, Organizations,$http,$upload ,fileReader) {
		$scope.authentication = Authentication;
		$scope.AllCompanyNames = Organizations.query();

		// Create new Organization
		$scope.create = function() {
			// Create new Organization object
			var organization = new Organizations ({
				name: this.name,
				email: this.email,
				licenses:this.licenses
			});

			// Redirect after save
			organization.$save(function(response) {
				// $location.path('/superadminindexpage'); 
				// Clear form fields
				$scope.name = '';
				$scope.email = '';
				$scope.licenses = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			return response._id;
		};

		// Remove existing Organization
		$scope.remove = function( organization ) {
			if ( organization ) { organization.$remove();

				for (var i in $scope.organizations ) {
					if ($scope.organizations [i] === organization ) {
						$scope.organizations.splice(i, 1);
					}
				}
			} else {
				$scope.organization.$remove(function() {
					$location.path('organizations');
				});
			}
		};

		// Update existing Organization
		$scope.update = function() {
			var organization = $scope.organization ;

			organization.$update(function() {
				$location.path('organizations/' + organization._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organizations
		$scope.find = function() {
			$scope.organizations = Organizations.query();
		};
// Find a list of Organizations
		$scope.findcomp = function() 
		{
			$scope.allorganizations = Organizations.query();
			console.log('$scope.allorganizations='+ $scope.allorganizations)
			$scope.gridOptions = {
				data: 'allorganizations',
				enablePaging: true,
				showFooter: true,
				multiSelect: false,
				columnDefs: [{field: 'name', displayName: 'Company name'}, 
                     		 {field:'email', displayName:'Email'},
                     		 {field: 'licenses', displayName: 'Licenses'}]
			};
		};

		// Find existing Organization
		$scope.findOne = function() {
			$scope.organization = Organizations.get({ 
		    organizationId: $stateParams.organizationId
			});
		};
		
		$scope.orgImage = Organizations.get({ 
		     organizationId: $scope.authentication.user.orgId
			});
		//provide preview for selected image
		  $scope.getFile = function () {
		  console.log('came inside getfile');
              fileReader.readAsDataUrl($scope.file, $scope)
                       .then(function(result) {
                          $scope.imageSrc = result;
                      });
            };
		
		$scope.onDropSelect = function($files) {
			 $scope.selectedFiles = [];
			  for (var i = 0; i < $files.length; i++) {
               $scope.selectedFiles = $files[i];
			   }
			   //provide preview for dropdown image
			  fileReader.readAsDataUrl( $scope.selectedFiles, $scope)
                       .then(function(result) {
                          $scope.imageSrc = result;
                      }); 
		};
		//function to upload selected or dropdown image
		$scope.updateSth = function() {
		console.log('$scope.cname2 11' + $scope.cname2)
		if (typeof $scope.Orglist == 'undefined'){
		    $scope.cname2 = $scope.orgImage.name;
		}
		else{
		   $scope.cname2 = $scope.Orglist.name;
		}
		console.log('$scope.cname2 22' + $scope.cname2)
		 console.log(" $scope.file ---",  $scope.file);
           $http({
					method: 'POST',
					url: '/upload',
					headers: {'Content-Type': 'multipart/form-data'},
					data: { name :$scope.cname2,
                            file: $scope.file,
                            dropfile: $scope.selectedFiles						
						  },
					 transformRequest: function (data, headersGetter) {
							var formData = new FormData();
							angular.forEach(data, function (value, key) {
								formData.append(key, value);
								console.log('key---->'+ key);
								console.log('value',value);
							});

							var headers = headersGetter();
							delete headers['Content-Type'];

							return formData;
						}
			}).
			success(function(data, status, headers, config) {
			     alert('success');
				  window.location.href = '/#!/uploadImageAdmin';
				  window.location.reload();

			  }).
			  error(function(data, status, headers, config) {
			       alert('failed');
			  });
         };		 
		
		$scope.files = [];
		$scope.setFiles = function(element) {	
		  $scope.$apply(function($scope) {
			  console.log('fields:', element.fields);
			  // Turn the FileList object into an Array
				for (var i = 0; i < element.files.length; i++) {
				  $scope.files.push(element.files[i])
				}
		    $scope.progressVisible = false;
			console.log('$scope.cname1: ' + $scope.cname);
			console.log("$scope.file: %j", $scope.file);
		  });
        };
		
		
            $scope.onFileSelect = function() {
			
				var fd = new FormData;
				for (var i in $scope.files) {
					fd.append("uploadedFile", $scope.files[i])
				}
					
					var image = $scope.files;
					 console.log('image:', image);
					if (angular.isArray(image)) {
						image = image[0];
					}
					angular.forEach(image[0], function(value , key) {
						console.log(key +" $scope.files--> "+  value);
					});
					
					
					//image['filenamenew'] = $scope.cname;
					//console.log("Image:" ,image );
					// This is how I handle file types in client side
					if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
						alert('Only PNG and JPEG are accepted.');
						return;
					}
				//console.log('$scope.cname2: ' + $scope.cname);
					$scope.uploadInProgress = true;
					$scope.uploadProgress = 0;
					$scope.upload = $upload.upload({
						url: '/upload',
						method: 'POST',
						file: image,
						field: $scope.cname
					}).progress(function(event) {
					   $scope.progressVisible = true;
						$scope.uploadProgress = Math.floor(event.loaded / event.total);
						 $scope.progress = Math.round(event.loaded * 100 / event.total)
						$scope.$apply();
					}).success(function(data, status, headers, config) {  
						 $scope.progressVisible = true;
						$scope.uploadInProgress = false;
						// If you need uploaded file immediately 
						//$scope.uploadedImage = JSON.parse(data);
						 //alert('success');				
					}).error(function(err) {
						alert('failed');
						$scope.uploadInProgress = false;
						console.log('Error uploading file: ' + err.message || err);
					});
					 $scope.upload='';
					  
			};
				
	}
]);