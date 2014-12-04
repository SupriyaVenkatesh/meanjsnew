'use strict';


var app=angular.module('users');

app.filter('selectFromSelected', function () {
		return function (incItems, value) {
		var out = [{}];
		console.log('value',value);
		if(value){
		for(x=0; x<incItems.length; x++){
		if(incItems[x].Value == value)
		out.push(incItems[x]);
		}
		return out;
		}
		else if(!value){
		return incItems
		}
		};
});

app.controller('AuthenticationController',['$scope','$filter', '$http', '$window','$location', 'Authentication','sharedProperties','Users','$stateParams','licenseProperties','rolesProperties','Organizations',
	function($scope, $filter,$http, $window, $location, Authentication,sharedProperties,Users,$stateParams,licenseProperties,rolesProperties,Organizations)
	 {
		$scope.authentication = Authentication;
		$scope.GlobalRoles = rolesProperties.all();
		$scope.GlobalCompany = sharedProperties.orgLength();
		$scope.GlobalUsers = Users.query();
	    $scope.GlobalOrganizations = sharedProperties.orgLength();
		$scope.mySelections = [];
        $scope.sample = [];
		$scope.peruser = [];
		
		$scope.find = function() {
		    $scope.allnames=$scope.Globalname;
			$scope.allCompanies= $scope.GlobalCompany;
			$scope.allRoles= $scope.GlobalRoles;
			//$scope.onlyUsers=[];
			$scope.Admincompany = Organizations.get({
                    organizationId: $scope.authentication.user.orgId
           });
			$scope.onlyUsers = Users.query(function (result) {
				//console.log(" $scope.onlyUsers-->", result);
				var len = result.length;
				//console.log('length', +len);
					//$scope.peruser = [];
					for (var x = 0; x < result.length; x++) {
						if (result[x].orgId == $scope.authentication.user.orgId)
							$scope.peruser.push(result[x]);
					}
				return $scope.peruser;
				
			});
			
			$scope.CheckLicenses = Users.query(function (result) {
				var len = result.length;
				//console.log('length', +len);
					$scope.licenseLength = [];
					for (var x = 0; x <result.length; x++) {
						if (result[x].orgId == $scope.authentication.user.orgId)
							$scope.licenseLength.push(result[x]);
					}
					
					if($scope.licenseLength.length > $scope.Admincompany.licenses){
					  console.log('over');
					}
					else
					{
					   console.log('not over');
					}
					console.log('$scope.licenseLength.length',$scope.licenseLength.length);
				return $scope.licenseLength.length;
				
			});
			
			$scope.InvoiceAdmin=[];
			if($scope.authentication.user.orgId=='54756b6e089822ac1fcd0225'){
			      $scope.InvoiceAdmin = $scope.onlyUsers;
			}
             else{
			    $scope.InvoiceAdmin = $scope.peruser; 
			 }			 
        
			$scope.filterOptions = {
				        filterText: ''
			};
			$scope.gridOptions = 
			{
				data: 'InvoiceAdmin',
				enablePaging: true,
				showFooter: true,
			    selectedItems: $scope.mySelections,
      			multiSelect: false,
				columnDefs: [{field: 'orgId', displayName: 'Company'}, 
                     		 {field:'firstName', displayName:'First Name'},
                     		 {field: 'lastName', displayName: 'Last Name'},
                     		 {field: 'email', displayName: 'Email'},
                     		 {field: 'role', displayName: 'Role'}],
							 filterOptions: $scope.filterOptions
		};
	    };
		
		//search by first name
		 $scope.filterName = function() {
			var filterText = '' + $scope.nameFilter;
			if (filterText !== '') {
			  $scope.filterOptions.filterText = filterText;
			} else {
			  $scope.filterOptions.filterText = '';
			}
		  };
		  //search by email
		 /*  $scope.filterEmail = function() {
			var filterText = 'email:' + $scope.emailFilter;
			if (filterText !== 'email:') {
			  $scope.filterOptions.filterText = filterText;
			} else {
			  $scope.filterOptions.filterText = '';
			}
		  };*/
		//if ($scope.authentication.user) $location.path('/accounts/create');
		
		/*$scope.signup = function() {
		     
		  $scope.credentials.role = $scope.credentials.newrole._id;
		  $scope.credentials.companyName = $scope.credentials.newcompany._id;
			if($scope.credentials.companyName != null && $scope.credentials.companyName != ''){
				if($scope.credentials.licenses != null && $scope.credentials.licenses != ''){
				  console.log(' if $scope.credentials-->'+  $scope.credentials);
				//console.log("value123--"+ $scope.credentials.licenses);
				licenseProperties.create($scope.credentials.licenses,function(result){
				angular.forEach(result, function(value, key) 
				    {
					      //console.log("value+--"+ value );
					});
					}
				);
				}
				sharedProperties.create($scope.credentials.companyName,function(result){
				angular.forEach(result, function(value , key) {
						if(key == '_id')
						{
						   //console.log("id+--"+ value );
							$scope.assingValue(value);	  
						}
					});
					}
				);
			}
			else {

				$scope.credentials.orgId = $scope.authentication.user.orgId;
				$scope.length = 0;
				
				angular.forEach($scope.GlobalUsers, function(value , key) {
			      angular.forEach(value, function(value1 , key1) {
					 if(key1 == 'orgId'){
					    if(value1 == $scope.authentication.user.orgId){
						   $scope.length ++;
						}
					 }
					});   		
				}); 
				//console.log("$scope.length = "+ $scope.length);
				if($scope.authentication.user.licenses > $scope.length ){
					$http.post('/auth/signup', $scope.credentials).success(function(response) {
						// If successful we assign the response to the global user model
						//$scope.authentication.user = response;
						// And redirect to the index page
						$location.path('/adminindexpage');
					}).error(function(response) {
						$scope.error = response.message;
					});
			    }
				else{
				  alert('sorry!. Your Licenses are over');
				  $scope.credentials ='';
				  
				}
				
			}
		};*/
			
		
		$scope.signupforUser = function() 
		{
	      $scope.credentials.role = $scope.credentials.newrole._id;
		  $scope.credentials.orgId = $scope.Admincompany._id;
		  $scope.credentials.displayName = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.username = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.password = $scope.credentials.firstName + $scope.credentials.lastName;
		  //$scope.credentials.org=[{name: $scope.credentials.company.name, id: $scope.credentials.company._id}]
		 $scope.sample.push({
		 	username: $scope.credentials.username,toaddress:$scope.credentials.email});
		  //$scope.sample.push({$scope.username,$scope.toaddress});
		  console.log("sample-->"+$scope.sample);
		  $http.post('/auth/signup', $scope.credentials).success(function(response) {
					$scope.onlyUsers = Users.query();
					
					$http.post('/auth/sendmailnewuser',$scope.sample).success(function(response) {
			     }).error(function(response){
					    		
				    });
				$scope.credentials ='';		
				}).error(function(response) {
					$scope.error = response.message;
			}); 
				} ;

		$scope.assingValue = function(value) {
			$scope.credentials.orgId = value;
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;
					$location.path('/superadminindexpage');
				}).error(function(response) {
					$scope.error = response.message;
			});
		};

		

		$scope.findOnebyIdtoEdit = function() {
			//console.log("$scope.mySelections---->"+$scope.mySelections);
			//console.log("$scope.mySelections00---->"+$scope.mySelections[0]);
			
		   angular.forEach($scope.mySelections[0] , function(value , key) 
		   {
			     
              //console.log(value +"value11-->>" +key);      
          
              $('#firstName').val($scope.mySelections[0]['firstName']); 
              $('#lastName').val($scope.mySelections[0]['lastName']); 
              $('#email').val($scope.mySelections[0]['email']); 
           }); 
			//$scope.credentials.company =  $scope.mySelections[0]['orgId'];
			//$scope.credentials.firstName = $scope.mySelections[0]['credentials.firstName'];
			//$scope.lastName = $scope.mySelections[0]['lastName'];
			//$scope.email = $scope.mySelections[0]['email'];

			
		}
   
		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				$scope.authentication.user = response;
				$scope.signinuser=$scope.authentication.user;
				$scope.userRole = $scope.authentication.user.role;
				
				angular.forEach($scope.GlobalRoles, function(value , key) {
				angular.forEach(value, function(value1 , key1) {
					if(key1 == '_id' && value1 == $scope.userRole){
					     if(value['name'] == 'superAdmin'){  
							   //$location.path('/superadminindexpage');
							   window.location.href = '/#!/superadminindexpage';
							    window.location.reload();
							   //route.reload();
						 }
						 else if(value['name'] == 'Admin'){
						       window.location.href = '/#!/adminindexpage';
							    window.location.reload();
						 } 
						 else if(value['name'] == 'admin'){
						       window.location.href = '/#!/adminindexpage';
							    window.location.reload();
						 } 
						else if(value['name'] == 'ADMIN'){
						       window.location.href = '/#!/adminindexpage';
							    window.location.reload();
						 }
						 else if(value['name'] == 'user'){
						        window.location.href = '/#!/userhome';
							    window.location.reload();
						 } 
						 else{
						        window.location.href = '/#!/userhome';
							    window.location.reload();
						 }
						}
					});	
				 });
				 
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
