'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Accounts','$http',
	function($scope, $stateParams, $location, Authentication, Accounts,$http) {
		
		$scope.authentication = Authentication;
		$scope.myData = [];
		$scope.myData = Accounts.query();
		$scope.mySelections = [];
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
			
			$scope.gridOptions = {
				data: 'myData',
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
				
		
		// Create new Account
		$scope.create = function() {
			
			if(angular.isUndefined(this.id__C)){
		    // Create new Account object
			var account = new Accounts ({
				firstName__C: this.firstName__C,
				lastName__C: this.lastName__C,
				company__C: this.company__C,
				phone__C: this.phone__C,
				address__C: this.address__C,
				date__C: this.date__C,
				country__c: this.country__c
			});

			// Redirect after save
			account.$save(function(response) {
				//Clear form fields
				$scope.firstName__C = '';
				$scope.lastName__C = '';
				$scope.company__C = '';
				$scope.phone__C = '';
				$scope.address__C = '';
				$scope.date__C = '';
				$scope.country__c = '';
				$scope.myData = Accounts.query();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			}else{

				var account = new Accounts ({
					firstName__C: this.firstName__C,
					lastName__C: this.lastName__C,
					company__C: this.company__C,
					phone__C: this.phone__C,
					address__C: this.address__C,
					date__C: this.date__C,
					country__c: this.country__c,
					_id:this.id__C
				});

				$scope.update(account);
			}
			
		};

		// Remove existing Account
		$scope.remove = function( account ) {
			if ( account ) {
			 account.$remove();
            	for (var i in $scope.accounts ) {
					if ($scope.accounts [i] === account ) {
						$scope.accounts.splice(i, 1);
					}
				}
			} else {
				$scope.account.$remove(function() {
					$scope.myData = Accounts.query();
				});
			}
		};

		// Update existing Account
		$scope.update = function(account) {
			//var account = $scope.account ;
			console.log(account);
			account.$update(function() {
				$scope.firstName__C = '';
				$scope.lastName__C = '';
				$scope.company__C = '';
				$scope.phone__C = '';
				$scope.address__C = '';
				$scope.date__C = '';
				$scope.country__c = '';
				$scope.id__C = '';
				$scope.myData = Accounts.query();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Accounts
		$scope.find = function() {
			$scope.accounts = Accounts.query();
		};

		// Find existing Account
		$scope.findOne = function() {
			$scope.account = Accounts.get({ 
				accountId: $stateParams.accountId
			});
		};

		// Find existing Account
		$scope.findOnebyId = function() {
			
			$scope.account = Accounts.get({ 
				accountId: $scope.mySelections[0]['_id']
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