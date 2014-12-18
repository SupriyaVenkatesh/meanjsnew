'use strict';
//Accounts Directive for currency input
/*
angular.module('accounts').directive('currencyInput', function() {
    return {
    
        scope: {
            field: '='
        },
        replace: true,
        template: '<span><input type="text" ng-model="field"></input></span>',
        link: function(scope, element, attrs) {

            $(element).bind('keyup', function(e) {
                var input = element.find('input');
                var inputVal = input.val();

                //clearing left side zeros
                while (scope.field.charAt(0) == '0') {
                    scope.field = scope.field.substr(1);
                }

                scope.field = scope.field.replace(/[^\d.\',']/g, '');

                var point = scope.field.indexOf(".");
                if (point >= 0) {
                    scope.field = scope.field.slice(0, point + 3);
                }

                var decimalSplit = scope.field.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];

                intPart = intPart.replace(/[^\d]/g, '');
                if (intPart.length > 3) {
                    var intDiv = Math.floor(intPart.length / 3);
                    while (intDiv > 0) {
                        var lastComma = intPart.indexOf(",");
                        if (lastComma < 0) {
                            lastComma = intPart.length;
                        }

                        if (lastComma - 3 > 0) {
                            intPart = intPart.splice(lastComma - 3, 0, ",");
                        }
                        intDiv--;
                    }
                }

                if (decPart === undefined) {
                    decPart = "";
                }
                else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;

                scope.$apply(function() {scope.field = res});
 
            });
        }
	//	return $scope.field;
    };
});

String.prototype.splice = function(idx, rem, s) {
    return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
};
*/

// Accounts controller
angular.module('accounts', ['fiestah.money']).controller('AccountsController', ['$scope','$modal', '$log' ,'$stateParams', '$location', 'Authentication', 'Accounts', '$http', 'Organizations',
    function($scope, $modal, $log,$stateParams, $location, Authentication, Accounts, $http, Organizations) {

        $scope.authentication = Authentication;
        $scope.myData = [];
		//$scope.field='';
        $scope.myData = Accounts.query();
        $scope.mySelections = [];
       $scope.items = [];
	    $scope.selected='';
        $scope.shouldBeDisabled = true;
        $scope.accountOwner__C = $scope.authentication.user.displayName;
       // console.log('$scope.authentication.user ==', $scope.authentication.user);
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
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
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
        $scope.setPagingData = function(data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.getPagedDataAsync = function(pageSize, page, searchText) {
            setTimeout(function() {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.get('jsonFiles/largeLoad.json').success(function(largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    });
                } else {
                    $http.get('jsonFiles/largeLoad.json').success(function(largeLoad) {
                        $scope.setPagingData(largeLoad, page, pageSize);
                    });
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.onlyAccounts = Accounts.query(function(result) {
           // console.log('result ==', result);
            var len = result.length;
            //console.log('length', +len);
            //$scope.peruser = [];
            for (var x = 0; x < result.length; x++) {
                if (result[x].user._id == $scope.authentication.user._id)
                    $scope.items.push(result[x]);
            }
            console.log('$scope.items ==', $scope.items);
            return $scope.items;

        });


        $scope.gridOptions = {
            data: 'items',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            selectedItems: $scope.mySelections,
            multiSelect: false,
            columnDefs: [{
                field: 'accountOwner__C',
                displayName: 'Account owner'
            }, {
                field: 'accountName__C',
                displayName: 'Account Name'
            }, {
                field: 'industry__C',
                displayName: 'Industry'
            }, {
                field: 'phone__C',
                displayName: 'Phone'
            }, {
                field: 'Description_C',
                displayName: 'Description'
            }]
        };


        $scope.generateId = function() {
            $scope.AllCompanies = Organizations.query();
            $scope.organization = Organizations.get({
                organizationId: $scope.authentication.user.orgId
            });
            //console.log('$scope.organization',$scope.organization);
            $scope.httpresponse = $http({
                method: 'POST',
                url: '/generateId',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    name: 'userid'
                },
                transformRequest: function(data, headersGetter) {
                    var formData = new FormData();
                    angular.forEach(data, function(value, key) {
                        formData.append(key, value);
                        //console.log('key---->'+ key);
                        //console.log('value',value);
                    });
                    var headers = headersGetter();
                    delete headers['Content-Type'];
                    return formData;
                }
            }).
            success(function(data, status, headers, config) {
               // console.log('data--->', data);
                $scope.create(data);
            }).
            error(function(data, status, headers, config) {
                console.log('id is failed');
            });

            console.log(' $scope.httpresponse--->', $scope.httpresponse);
        };
          
		  // $scope.items = ['item1', 'item2', 'item3'];
		   $scope.openPopup = function () {
				var modalInstance = $modal.open({
				  templateUrl: 'modules/accounts/views/modal.html',
				  controller: ModalInstanceCtrl,
				  resolve: {
					items: function () {
					  return $scope.items;
					}
				  }
				});
				modalInstance.result.then(function (selectedItem) {
				  $scope.selected = selectedItem;
				  console.log(' $scope.selected', $scope.selected);
				}, function () {
				  $log.info('Modal dismissed at: ' + new Date());
				});
			};
		  
		  
		//Copy Billing Address to Shipping AddressAddress 
		  $scope.copyBaddressToSaddress = function() {
		    $scope.enable = true;
			if( $scope.enable == true){
              $scope.Saddress = $scope.Baddress;
             }
            	 $scope.enable =false;		 
		  };
		 
        // Create new Account
        $scope.create = function(data) {
		 console.log(' $scope.selected in create method', $scope.selected);
		$scope.parentAccount =[];
		if (angular.isUndefined(this.Baddress)){
		   	$scope.Baddress = '';
		}
		
		//console.log('$scope.parentAccount ==', $scope.parentAccount);
            if (angular.isUndefined(this.id__C)) {
                // Create new Account object
                var account = new Accounts({
      
                    accountOwner__C: this.accountOwner__C,
                    rating__C: this.rating__C,
                    accountName__C: this.accountName__C,
                    phone__C: this.phone__C,
                    pAccount__C: $scope.selected,
                    fax__C: this.fax__C,
                    accountNumber__C: this.accountNumber__C,
					website__C: this.website__C,
					accountSite__C: this.accountSite__C,
					type__C: this.type__C,
					annualRevenue__C: this.annualRevenue__C,
					ownership__C: this.ownership__C,
					employees__C: this.employees__C,
					industry__C: this.industry__C,
				
				Baddress :{
				           Country_C : this.Baddress.Country_C,
						   Street_C : this.Baddress.Street_C,
						   City_C: this.Baddress.City_C,
					       State_C: this.Baddress.State_C,
					       ZipCode_C: this.Baddress.ZipCode_C
					   },
				Saddress :{
				           Country_C : this.Baddress.Country_C,
						   Street_C : this.Baddress.Street_C,
						   City_C: this.Baddress.City_C,
					       State_C: this.Baddress.State_C,
					       ZipCode_C: this.Baddress.ZipCode_C
					   },
				
					Description_C: this.Description_C
					
                });
               // console.log('account--->', account);
                // Redirect after save
                account.$save(function(response) {
                    //Clear form fields
                    //$scope.accountOwner__C = '';
					$scope.rating__C = '';
					$scope.phone__C = '';
					$scope.accountName__C = '';
					$scope.selected = '';
					$scope.fax__C = '';
					$scope.accountNumber__C = '';
					$scope.website__C = '';
					$scope.accountSite__C = '';
					$scope.type__C = '';
					$scope.annualRevenue__C = '';
					$scope.ownership__C = '';
					$scope.employees__C = '';
					$scope.industry__C = '';
					
					$scope.Baddress = '';
					$scope.Saddress = '';
					
                    $scope.Description_C = '';
                }, function(errorResponse) {
                    console.log('account is not created');
                    $scope.error = errorResponse.data.message;
                   // console.log('$scope.error---', $scope.error.length);
                    alert($scope.error);
                });

            } else {

                var account = new Accounts({
                    firstName__C: this.firstName__C,
                    lastName__C: this.lastName__C,
                    company__C: this.company__C,
                    phone__C: this.phone__C,
                    address__C: this.address__C,
                    date__C: this.date__C,
                    country__c: this.country__c,
                    _id: this.id__C
                });

                $scope.update(account);
            }

        };

        // Remove existing Account
        $scope.remove = function(account) {
            if (account) {
                account.$remove();
                for (var i in $scope.accounts) {
                    if ($scope.accounts[i] === account) {
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

            $scope.firstName__C = $scope.mySelections[0]['firstName__C'];
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



var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0].accountName__C
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
