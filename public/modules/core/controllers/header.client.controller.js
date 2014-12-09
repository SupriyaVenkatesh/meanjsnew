'use strict';
var app = angular.module('core');
app.controller('HeaderController', ['$scope', 'Authentication', 'Menus','sharedProperties','Organizations',
	function($scope, Authentication, Menus,sharedProperties,Organizations) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.AllCompanies = Organizations.query(); 
		if(typeof $scope.authentication.user.orgId =="undefined"){
		//console.log('if');
		$scope.organization=[];
		$scope.organization.name = 'Invoiceit';
		}
		   else{
			$scope.organization = Organizations.get({ 
				organizationId: $scope.authentication.user.orgId
			});
			}
        $scope.orgname = $scope.organization.name +'_logo.png';
		//console.log(' $scope.orgname  = ' ,  $scope.orgname  );
		 /*angular.forEach( $scope.AllCompanies,function(value,index){
                alert('hello');
          })*/
		 $scope.LogoName= "InvoiceIT.com_logo.png";
		 $scope.LogoName2= "InvoiceIT.com";
		 //console.log('$scope.authentication.user.orgId = ', $scope.authentication.user.orgId );
		$scope.menu = Menus.getMenu('topbar');
	
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);