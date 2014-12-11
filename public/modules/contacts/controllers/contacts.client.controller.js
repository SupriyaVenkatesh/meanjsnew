'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts','$http',
	function($scope, $stateParams, $location, Authentication, Contacts,$http ) {
		$scope.authentication = Authentication;
		$scope.myData = [];
		$scope.myData = Contacts.query();
		$scope.mySelections = [];
		$scope.perContact =[];
		$scope.date__C = new Date();
		$scope.filterOptions = {
			filterText: "",
			useExternalFilter: true
		}; 
			
		$scope.totalServerItems = 0;
		$scope.pagingOptions = {
			pageSizes: [250, 500, 1000],
			pageSize: 250,
			currentPage: 1
		};	
		
		$scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
		
		$scope.setPagingData = function(data, page, pageSize){	
			var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
			$scope.myData = pagedData;
			$scope.totalServerItems = data.length;
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		};
			$scope.getPagedDataAsync = function (pageSize, page, searchText) {
				setTimeout(function () {
					var data;
					if (searchText) {
						var ft = searchText.toLowerCase();
						$http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {		
							data = largeLoad.filter(function(item) {
								return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
							});
							$scope.setPagingData(data,page,pageSize);
						});            
					} else {
						$http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
							$scope.setPagingData(largeLoad,page,pageSize);
						});
					}
				}, 100);
			};
			
			$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
			
			$scope.$watch('pagingOptions', function (newVal, oldVal) {
				if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
				  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
				}
			}, true);
			$scope.$watch('filterOptions', function (newVal, oldVal) {
				if (newVal !== oldVal) {
				  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
				}
			}, true);
			
			
			$scope.onlyContacts = Contacts.query(function (result) {
			console.log('result ==',result);
				var len = result.length;
				console.log('length', +len);
					//$scope.peruser = [];
					for (var x = 0; x < result.length; x++) {
						if (result[x].user._id == $scope.authentication.user._id)
							$scope.perContact.push(result[x]);
					}
					console.log('$scope.perContact ==',$scope.perContact);
				return $scope.perContact;
				
			});
			
			$scope.gridOptions = {
				data: 'perContact',
				enablePaging: true,
				showFooter: true,
				totalServerItems: 'totalServerItems',
				pagingOptions: $scope.pagingOptions,
				filterOptions: $scope.filterOptions,
				selectedItems: $scope.mySelections,
      			multiSelect: false,
                columnDefs: [{field: 'firstName__C', displayName: 'First Name'}, 
                     		 {field:'lastName__C', displayName:'Last Name'},
                     		 {field: 'company__C', displayName: 'Company'},
                     		 {field: 'phone__C', displayName: 'Phone'},
                     		 {field: 'address__C', displayName: 'Address'},
                     		 {field: 'date__C', displayName: 'Date'},
                     		 {field: 'country__c', displayName: 'Country'}]
			};

		// Create new Contact
		$scope.create = function() {
			if(angular.isUndefined(this.id__C)){
				// Create new Contact object
				var contact = new Contacts ({
					firstName__C: this.firstName__C,
					lastName__C: this.lastName__C,
					company__C: this.company__C,
					phone__C: this.phone__C,
					address__C: this.address__C,
					//date__C: this.date__C,
					country__c: this.country__c
				});

				// Redirect after save
				contact.$save(function(response) {
					// Clear form fields
					$scope.firstName__C = '';
					$scope.lastName__C = '';
					$scope.company__C = '';
					$scope.phone__C = '';
					$scope.address__C = '';
					$scope.date__C = '';
					$scope.country__c = '';
					$scope.myData = Contacts.query();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});

			}else{

				var contact = new Contacts ({
					firstName__C: this.firstName__C,
					lastName__C: this.lastName__C,
					company__C: this.company__C,
					phone__C: this.phone__C,
					address__C: this.address__C,
					date__C: this.date__C,
					country__c: this.country__c,
					_id:this.id__C
				});

				$scope.update(contact); 

			}
		};

		// Remove existing Contact
		$scope.remove = function( contact ) {
			if ( contact ) { contact.$remove();

				for (var i in $scope.contacts ) {
					if ($scope.contacts [i] === contact ) {
						$scope.contacts.splice(i, 1);
					}
				}
			} else {
				$scope.contact.$remove(function() {
					$scope.myData = Contacts.query();
				});
			}
		};

		// Update existing Contact
		$scope.update = function() {
			var contact = $scope.contact ;

			contact.$update(function() {
				$scope.firstName__C = '';
				$scope.lastName__C = '';
				$scope.company__C = '';
				$scope.phone__C = '';
				$scope.address__C = '';
				$scope.date__C = '';
				$scope.country__c = '';
				$scope.id__C = '';
				$scope.myData = Contacts.query();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contacts
		$scope.find = function() {
			$scope.contacts = Contacts.query();
		};

		// Find existing Contact
		$scope.findOne = function() {
			$scope.contact = Contacts.get({ 
				contactId: $stateParams.contactId
			});
		};

		$scope.findOnebyId = function() {
			
			$scope.contact = Contacts.get({ 
				contactId: $scope.mySelections[0]['_id']
			});
			
		};
		
		$scope.findOnebyIdtoEdit = function() {
			
			$scope.firstName__C =  $scope.mySelections[0]['firstName__C'];
			$scope.id__C = $scope.mySelections[0]['_id'];
			$scope.lastName__C = $scope.mySelections[0]['lastName__C'];
			$scope.company__C = $scope.mySelections[0]['company__C'];
			$scope.phone__C = $scope.mySelections[0]['phone__C'];
			$scope.address__C = $scope.mySelections[0]['address__C'];
			$scope.date__C = $scope.mySelections[0]['date__C'];
			$scope.country__c = $scope.mySelections[0]['country__c'];
		}
	}
]);