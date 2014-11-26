'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'inoviceit';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils','ngGrid'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('accounts');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('airtel');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contacts');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('licenses');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('organizations');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('roles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Articles module
angular.module('accounts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Accounts', 'accounts', 'dropdown', '/accounts(/create)?');
		Menus.addSubMenuItem('topbar', 'accounts', 'List Accounts', 'accounts');
		Menus.addSubMenuItem('topbar', 'accounts', 'New Account', 'accounts/create');
	}
]);
'use strict';

//Setting up route
angular.module('accounts').config(['$stateProvider',
	function($stateProvider) {
		// Accounts state routing
		$stateProvider.
		state('listAccounts', {
			url: '/accounts',
			templateUrl: 'modules/accounts/views/list-accounts.client.view.html'
		}).
		state('createAccount', {
			url: '/accounts/create',
			templateUrl: 'modules/accounts/views/create-account.client.view.html'
		}).
		state('viewAccount', {
			url: '/accounts/:accountId',
			templateUrl: 'modules/accounts/views/view-account.client.view.html'
		}).
		state('editAccount', {
			url: '/accounts/:accountId/edit',
			templateUrl: 'modules/accounts/views/edit-account.client.view.html'
		});
	}
]);
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
'use strict';

//Accounts service used to communicate Accounts REST endpoints
angular.module('accounts').factory('Accounts', ['$resource',
	function($resource) {
		return $resource('accounts/:accountId', { accountId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('contacts').config(['$stateProvider',
	function($stateProvider) {
		// Contacts state routing
		$stateProvider.
		state('listContacts', {
			url: '/contacts',
			templateUrl: 'modules/contacts/views/list-contacts.client.view.html'
		}).
		state('createContact', {
			url: '/contacts/create',
			templateUrl: 'modules/contacts/views/create-contact.client.view.html'
		}).
		state('viewContact', {
			url: '/contacts/:contactId',
			templateUrl: 'modules/contacts/views/view-contact.client.view.html'
		}).
		state('editContact', {
			url: '/contacts/:contactId/edit',
			templateUrl: 'modules/contacts/views/edit-contact.client.view.html'
		});
	}
]);
'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts',
	function($scope, $stateParams, $location, Authentication, Contacts ) {
		$scope.authentication = Authentication;
		$scope.myData = [];
		$scope.myData = Contacts.query();
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
					date__C: this.date__C,
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
'use strict';

//Contacts service used to communicate Contacts REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
	function($resource) {
		return $resource('contacts/:contactId', { contactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('userhome', {
			url: '/userhome',
			templateUrl: 'modules/core/views/userindexpage.html'
		}).
		state('accountDetailPage', {
			url: '/accountDetailPage',
			templateUrl: 'modules/accounts/views/account-home.html'
		}).
		state('contactDetailPage', {
			url: '/contactDetailPage',
			templateUrl: 'modules/contacts/views/contact-home.html'
		}).
		state('adminsingupPage', {
			url: '/adminsingupPage',
			templateUrl: 'modules/organizations/views/admin-login.html'
		}).
		state('superadminindexpage', {
			url: '/superadminindexpage',
			templateUrl: 'modules/core/views/superadminindexpage.html'
		}).
		state('adminindexpage', {
			url: '/adminindexpage',
			templateUrl: 'modules/core/views/adminindexpage.html'
		}).
		state('adminCreateUser', {
			url: '/adminCreateUser',
			templateUrl: 'modules/core/views/adminCreateUser.html'
		}).
		state('uploadImageAdmin', {
			url: '/uploadImageAdmin',
			templateUrl: 'modules/core/views/uploadImageAdmin.html'
		}).
		state('uploadimage', {
			url: '/uploadimage',
			templateUrl: 'modules/core/views/uploadimage.html'
		}).
		state('createRoles', {
			url: '/createRoles',
			templateUrl: 'modules/core/views/createRoles.html'
		}).
		state('OrganizationCreatePage', {
			url: '/OrganizationCreatePage',
			templateUrl: 'modules/organizations/views/create-organization.client.view.html'
		}).
		state('viewadmins', {
			url: '/viewadmins',
			templateUrl: 'modules/core/views/viewadmins.html'
		}).
		state('createuserpage', {
			url: '/createuserpage',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('viewusers', {
			url: '/viewusers',
			templateUrl: 'modules/core/views/viewusers.html'
		});
	}
]);
'use strict';
var app = angular.module('core');
app.controller('HeaderController', ['$scope', 'Authentication', 'Menus','sharedProperties','Organizations',
	function($scope, Authentication, Menus,sharedProperties,Organizations) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.AllCompanies = Organizations.query(); 
			$scope.organization = Organizations.get({ 
				organizationId: $scope.authentication.user.orgId
			});
				//console.log('$scope.organization1  = ' , $scope.organization  );
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
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('licenses').config(['$stateProvider',
	function($stateProvider) {
		// Licenses state routing
		$stateProvider.
		state('listLicenses', {
			url: '/licenses',
			templateUrl: 'modules/licenses/views/list-licenses.client.view.html'
		}).
		state('createLicense', {
			url: '/licenses/create',
			templateUrl: 'modules/licenses/views/create-license.client.view.html'
		}).
		state('viewLicense', {
			url: '/licenses/:licenseId',
			templateUrl: 'modules/licenses/views/view-license.client.view.html'
		}).
		state('editLicense', {
			url: '/licenses/:licenseId/edit',
			templateUrl: 'modules/licenses/views/edit-license.client.view.html'
		});
	}
]);
'use strict';

angular.module('licenses', []).service('licenseProperties', ["Licenses", "$q", function (Licenses,$q){
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
}]);

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
'use strict';

//Licenses service used to communicate Licenses REST endpoints
angular.module('licenses').factory('Licenses', ['$resource',
	function($resource) {
		return $resource('licenses/:licenseId', { licenseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('organizations').config(['$stateProvider',
	function($stateProvider) {
		// Organizations state routing
		$stateProvider.
		state('listOrganizations', {
			url: '/organizations',
			templateUrl: 'modules/organizations/views/list-organizations.client.view.html'
		}).
		state('createOrganization', {
			url: '/organizations/create',
			templateUrl: 'modules/organizations/views/create-organization.client.view.html'
		}).
		state('viewOrganization', {
			url: '/organizations/:organizationId',
			templateUrl: 'modules/organizations/views/view-organization.client.view.html'
		}).
		state('editOrganization', {
			url: '/organizations/:organizationId/edit',
			templateUrl: 'modules/organizations/views/edit-organization.client.view.html'
		});
	}
]);
'use strict';
var app = angular.module('organizations',['angularFileUpload']);
app.service('sharedProperties', ["Organizations", "$q", function (Organizations,$q){
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
}]);
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
'use strict';

//Organizations service used to communicate Organizations REST endpoints
angular.module('organizations').factory('Organizations', ['$resource',
	function($resource) {
		return $resource('organizations/:organizationId', { organizationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('roles').config(['$stateProvider',
	function($stateProvider) {
		// Roles state routing
		$stateProvider.
		state('listRoles', {
			url: '/roles',
			templateUrl: 'modules/roles/views/list-roles.client.view.html'
		}).
		state('createRole', {
			url: '/roles/create',
			templateUrl: 'modules/roles/views/create-role.client.view.html'
		}).
		state('viewRole', {
			url: '/roles/:roleId',
			templateUrl: 'modules/roles/views/view-role.client.view.html'
		}).
		state('editRole', {
			url: '/roles/:roleId/edit',
			templateUrl: 'modules/roles/views/edit-role.client.view.html'
		});
	}
]);
'use strict';
var app=angular.module('roles', [] );
app.service('rolesProperties', ["Roles", function (Roles){
	var RolesList = Roles.query();
	 return {
    all: function() {
      return RolesList;
    },
    first: function() {
      return RolesList[0];
    }
  };
}]);

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
'use strict';

//Roles service used to communicate Roles REST endpoints
angular.module('roles').factory('Roles', ['$resource',
	function($resource) {
		return $resource('roles/:roleId', { roleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								//Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

var app=angular.module('users', [] );
app.controller('AuthenticationController',['$scope', '$http', '$window','$location', 'Authentication','sharedProperties','Users','$stateParams','licenseProperties','rolesProperties',
	function($scope, $http, $window, $location, Authentication,sharedProperties,Users,$stateParams,licenseProperties,rolesProperties)
	 {
		$scope.authentication = Authentication;
		$scope.GlobalRoles = rolesProperties.all();
		$scope.GlobalCompany = sharedProperties.orgLength();
		$scope.GlobalUsers = Users.query();
	    $scope.GlobalOrganizations = sharedProperties.orgLength();
		$scope.mySelections = [];
        //Load list of Users
		$scope.find = function() {
		$scope.OnlyAdmnUsers = Users.get({ 
				userorgId: $scope.authentication.user.orgId
			});	
			 console.log(' 	$scope.OnlyAdmnUsers-->', 	$scope.OnlyAdmnUsers); 
		    $scope.allnames=$scope.Globalname;
			$scope.allCompanies= $scope.GlobalCompany;
		
			$scope.allRoles= $scope.GlobalRoles;
			$scope.onlyUsers=[];
			$scope.onlyUsers = Users.query();
              console.log(" $scope.onlyUsers11--", $scope.onlyUsers);
			angular.forEach($scope.users , function(value , key) {
			      angular.forEach(value, function(value1 , key1) {
                        if(key1 == 'orgId' && value1 == $scope.authentication.user.orgId){
						 $scope.onlyUsers.push(value);
						}
					});   		
				}); 
				console.log(" $scope.onlyUsers22--", $scope.onlyUsers);
			$scope.gridOptions = 
			{
				data: 'onlyUsers',
				enablePaging: true,
				showFooter: true,
			    selectedItems: $scope.mySelections,
      			multiSelect: false,
				columnDefs: [{field: 'orgId', displayName: 'Company'}, 
                     		 {field:'firstName', displayName:'First Name'},
                     		 {field: 'lastName', displayName: 'Last Name'},
                     		 {field: 'email', displayName: 'Email'},
                     		 {field: 'role', displayName: 'Role'}]
		};
	    };
		//if ($scope.authentication.user) $location.path('/accounts/create');
		
		$scope.signup = function() {
		     
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
		};
			
		
		$scope.signupforUser = function() 
		{
		  var sample = [];
	      $scope.credentials.role = $scope.credentials.newrole._id;
		  $scope.credentials.orgId = $scope.credentials.company._id;
		  $scope.credentials.displayName = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.username = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.password = $scope.credentials.firstName + $scope.credentials.lastName;
		  $scope.credentials.org=[{name: $scope.credentials.company.name, id: $scope.credentials.company._id}]
		  var username=$scope.credentials.username;
          var toaddress=$scope.credentials.email;
		  sample.push({ username,toaddress});
		  $http.post('/auth/signup', $scope.credentials).success(function(response) {
					$scope.onlyUsers = Users.query();
					$http.post('/auth/sendmailnewuser',sample).success(function(response) {
						       	
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

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
"use strict";var ApplicationConfiguration=function(){var a="inoviceit",b=["ngResource","ngCookies","ngAnimate","ngTouch","ngSanitize","ui.router","ui.bootstrap","ui.utils","ngGrid"],c=function(b,c){angular.module(b,c||[]),angular.module(a).requires.push(b)};return{applicationModuleName:a,applicationModuleVendorDependencies:b,registerModule:c}}();angular.module(ApplicationConfiguration.applicationModuleName,ApplicationConfiguration.applicationModuleVendorDependencies),angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider",function(a){a.hashPrefix("!")}]),angular.element(document).ready(function(){"#_=_"===window.location.hash&&(window.location.hash="#!"),angular.bootstrap(document,[ApplicationConfiguration.applicationModuleName])}),ApplicationConfiguration.registerModule("accounts"),ApplicationConfiguration.registerModule("airtel"),ApplicationConfiguration.registerModule("contacts"),ApplicationConfiguration.registerModule("core"),ApplicationConfiguration.registerModule("licenses"),ApplicationConfiguration.registerModule("organizations"),ApplicationConfiguration.registerModule("roles"),ApplicationConfiguration.registerModule("users"),angular.module("accounts").run(["Menus",function(a){a.addMenuItem("topbar","Accounts","accounts","dropdown","/accounts(/create)?"),a.addSubMenuItem("topbar","accounts","List Accounts","accounts"),a.addSubMenuItem("topbar","accounts","New Account","accounts/create")}]),angular.module("accounts").config(["$stateProvider",function(a){a.state("listAccounts",{url:"/accounts",templateUrl:"modules/accounts/views/list-accounts.client.view.html"}).state("createAccount",{url:"/accounts/create",templateUrl:"modules/accounts/views/create-account.client.view.html"}).state("viewAccount",{url:"/accounts/:accountId",templateUrl:"modules/accounts/views/view-account.client.view.html"}).state("editAccount",{url:"/accounts/:accountId/edit",templateUrl:"modules/accounts/views/edit-account.client.view.html"})}]),angular.module("accounts").controller("AccountsController",["$scope","$stateParams","$location","Authentication","Accounts","$http",function(a,b,c,d,e,f){a.authentication=d,a.myData=[],a.myData=e.query(),a.mySelections=[],a.filterOptions={filterText:"",useExternalFilter:!0},a.totalServerItems=0,a.pagingOptions={pageSizes:[250,500,1e3],pageSize:250,currentPage:1},a.setPagingData=function(b,c,d){var e=b.slice((c-1)*d,c*d);a.myData=e,a.totalServerItems=b.length,a.$$phase||a.$apply()},a.getPagedDataAsync=function(b,c,d){setTimeout(function(){var e;if(d){var g=d.toLowerCase();f.get("jsonFiles/largeLoad.json").success(function(d){e=d.filter(function(a){return-1!=JSON.stringify(a).toLowerCase().indexOf(g)}),a.setPagingData(e,c,b)})}else f.get("jsonFiles/largeLoad.json").success(function(d){a.setPagingData(d,c,b)})},100)},a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage),a.$watch("pagingOptions",function(b,c){b!==c&&b.currentPage!==c.currentPage&&a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)},!0),a.$watch("filterOptions",function(b,c){b!==c&&a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)},!0),a.gridOptions={data:"myData",enablePaging:!0,showFooter:!0,totalServerItems:"totalServerItems",pagingOptions:a.pagingOptions,filterOptions:a.filterOptions,selectedItems:a.mySelections,multiSelect:!1,columnDefs:[{field:"firstName__C",displayName:"First Name"},{field:"lastName__C",displayName:"Last Name"},{field:"company__C",displayName:"Company"},{field:"phone__C",displayName:"Phone"},{field:"address__C",displayName:"Address"},{field:"date__C",displayName:"Date"},{field:"country__c",displayName:"Country"}]},a.create=function(){if(angular.isUndefined(this.id__C)){var b=new e({firstName__C:this.firstName__C,lastName__C:this.lastName__C,company__C:this.company__C,phone__C:this.phone__C,address__C:this.address__C,date__C:this.date__C,country__c:this.country__c});b.$save(function(){a.firstName__C="",a.lastName__C="",a.company__C="",a.phone__C="",a.address__C="",a.date__C="",a.country__c="",a.myData=e.query()},function(b){a.error=b.data.message})}else{var b=new e({firstName__C:this.firstName__C,lastName__C:this.lastName__C,company__C:this.company__C,phone__C:this.phone__C,address__C:this.address__C,date__C:this.date__C,country__c:this.country__c,_id:this.id__C});a.update(b)}},a.remove=function(b){if(b){b.$remove();for(var c in a.accounts)a.accounts[c]===b&&a.accounts.splice(c,1)}else a.account.$remove(function(){a.myData=e.query()})},a.update=function(b){console.log(b),b.$update(function(){a.firstName__C="",a.lastName__C="",a.company__C="",a.phone__C="",a.address__C="",a.date__C="",a.country__c="",a.id__C="",a.myData=e.query()},function(b){a.error=b.data.message})},a.find=function(){a.accounts=e.query()},a.findOne=function(){a.account=e.get({accountId:b.accountId})},a.findOnebyId=function(){a.account=e.get({accountId:a.mySelections[0]._id})},a.findOnebyIdtoEdit=function(){a.firstName__C=a.mySelections[0].firstName__C,a.id__C=a.mySelections[0]._id,a.lastName__C=a.mySelections[0].lastName__C,a.company__C=a.mySelections[0].company__C,a.phone__C=a.mySelections[0].phone__C,a.address__C=a.mySelections[0].address__C,a.date__C=a.mySelections[0].date__C,a.country__c=a.mySelections[0].country__c}}]),angular.module("accounts").factory("Accounts",["$resource",function(a){return a("accounts/:accountId",{accountId:"@_id"},{update:{method:"PUT"}})}]),angular.module("contacts").config(["$stateProvider",function(a){a.state("listContacts",{url:"/contacts",templateUrl:"modules/contacts/views/list-contacts.client.view.html"}).state("createContact",{url:"/contacts/create",templateUrl:"modules/contacts/views/create-contact.client.view.html"}).state("viewContact",{url:"/contacts/:contactId",templateUrl:"modules/contacts/views/view-contact.client.view.html"}).state("editContact",{url:"/contacts/:contactId/edit",templateUrl:"modules/contacts/views/edit-contact.client.view.html"})}]),angular.module("contacts").controller("ContactsController",["$scope","$stateParams","$location","Authentication","Contacts",function(a,b,c,d,e){a.authentication=d,a.myData=[],a.myData=e.query(),a.mySelections=[],a.filterOptions={filterText:"",useExternalFilter:!0},a.totalServerItems=0,a.pagingOptions={pageSizes:[250,500,1e3],pageSize:250,currentPage:1},a.setPagingData=function(b,c,d){var e=b.slice((c-1)*d,c*d);a.myData=e,a.totalServerItems=b.length,a.$$phase||a.$apply()},a.getPagedDataAsync=function(b,c,d){setTimeout(function(){var e;if(d){var f=d.toLowerCase();$http.get("jsonFiles/largeLoad.json").success(function(d){e=d.filter(function(a){return-1!=JSON.stringify(a).toLowerCase().indexOf(f)}),a.setPagingData(e,c,b)})}else $http.get("jsonFiles/largeLoad.json").success(function(d){a.setPagingData(d,c,b)})},100)},a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage),a.$watch("pagingOptions",function(b,c){b!==c&&b.currentPage!==c.currentPage&&a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)},!0),a.$watch("filterOptions",function(b,c){b!==c&&a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)},!0),a.gridOptions={data:"myData",enablePaging:!0,showFooter:!0,totalServerItems:"totalServerItems",pagingOptions:a.pagingOptions,filterOptions:a.filterOptions,selectedItems:a.mySelections,multiSelect:!1,columnDefs:[{field:"firstName__C",displayName:"First Name"},{field:"lastName__C",displayName:"Last Name"},{field:"company__C",displayName:"Company"},{field:"phone__C",displayName:"Phone"},{field:"address__C",displayName:"Address"},{field:"date__C",displayName:"Date"},{field:"country__c",displayName:"Country"}]},a.create=function(){if(angular.isUndefined(this.id__C)){var b=new e({firstName__C:this.firstName__C,lastName__C:this.lastName__C,company__C:this.company__C,phone__C:this.phone__C,address__C:this.address__C,date__C:this.date__C,country__c:this.country__c});b.$save(function(){a.firstName__C="",a.lastName__C="",a.company__C="",a.phone__C="",a.address__C="",a.date__C="",a.country__c="",a.myData=e.query()},function(b){a.error=b.data.message})}else{var b=new e({firstName__C:this.firstName__C,lastName__C:this.lastName__C,company__C:this.company__C,phone__C:this.phone__C,address__C:this.address__C,date__C:this.date__C,country__c:this.country__c,_id:this.id__C});a.update(b)}},a.remove=function(b){if(b){b.$remove();for(var c in a.contacts)a.contacts[c]===b&&a.contacts.splice(c,1)}else a.contact.$remove(function(){a.myData=e.query()})},a.update=function(){var b=a.contact;b.$update(function(){a.firstName__C="",a.lastName__C="",a.company__C="",a.phone__C="",a.address__C="",a.date__C="",a.country__c="",a.id__C="",a.myData=e.query()},function(b){a.error=b.data.message})},a.find=function(){a.contacts=e.query()},a.findOne=function(){a.contact=e.get({contactId:b.contactId})},a.findOnebyId=function(){a.contact=e.get({contactId:a.mySelections[0]._id})},a.findOnebyIdtoEdit=function(){a.firstName__C=a.mySelections[0].firstName__C,a.id__C=a.mySelections[0]._id,a.lastName__C=a.mySelections[0].lastName__C,a.company__C=a.mySelections[0].company__C,a.phone__C=a.mySelections[0].phone__C,a.address__C=a.mySelections[0].address__C,a.date__C=a.mySelections[0].date__C,a.country__c=a.mySelections[0].country__c}}]),angular.module("contacts").factory("Contacts",["$resource",function(a){return a("contacts/:contactId",{contactId:"@_id"},{update:{method:"PUT"}})}]),angular.module("core").config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),a.state("home",{url:"/",templateUrl:"modules/users/views/authentication/signin.client.view.html"}).state("userhome",{url:"/userhome",templateUrl:"modules/core/views/userindexpage.html"}).state("accountDetailPage",{url:"/accountDetailPage",templateUrl:"modules/accounts/views/account-home.html"}).state("contactDetailPage",{url:"/contactDetailPage",templateUrl:"modules/contacts/views/contact-home.html"}).state("adminsingupPage",{url:"/adminsingupPage",templateUrl:"modules/organizations/views/admin-login.html"}).state("superadminindexpage",{url:"/superadminindexpage",templateUrl:"modules/core/views/superadminindexpage.html"}).state("adminindexpage",{url:"/adminindexpage",templateUrl:"modules/core/views/adminindexpage.html"}).state("uploadimage",{url:"/uploadimage",templateUrl:"modules/core/views/uploadimage.html"}).state("createRoles",{url:"/createRoles",templateUrl:"modules/core/views/createRoles.html"}).state("viewadmins",{url:"/viewadmins",templateUrl:"modules/core/views/viewadmins.html"}).state("createuserpage",{url:"/createuserpage",templateUrl:"modules/users/views/authentication/signup.client.view.html"}).state("viewusers",{url:"/viewusers",templateUrl:"modules/core/views/viewusers.html"})}]);var app=angular.module("core");app.controller("HeaderController",["$scope","Authentication","Menus","sharedProperties","Organizations",function(a,b,c,d,e){a.authentication=b,a.isCollapsed=!1,a.AllCompanies=e.query(),a.findOne=function(){a.organization=e.get({organizationId:a.authentication.user.orgId}),console.log("$scope.organization1  = ",a.organization)},angular.forEach(a.AllCompanies,function(b){angular.forEach(b,function(c,d){"_id"==d&&c==a.authentication.user.orgId&&(a.recvalue(b.name),console.log("  $scope.orgname  = "+a.orgname))})}),a.LogoName="invoice.png",a.LogoName2="img",a.menu=c.getMenu("topbar"),a.recvalue=function(b){console.log("came inside"),a.varName=b,console.log("$scope.varName = ",a.varName)},console.log("$scope.varName2 = ",a.varName),a.toggleCollapsibleMenu=function(){a.isCollapsed=!a.isCollapsed},a.$on("$stateChangeSuccess",function(){a.isCollapsed=!1})}]),angular.module("core").controller("HomeController",["$scope","Authentication",function(a,b){a.authentication=b}]),angular.module("core").service("Menus",[function(){this.defaultRoles=["*"],this.menus={};var a=function(a){if(!a)return this.isPublic;if(~this.roles.indexOf("*"))return!0;for(var b in a.roles)for(var c in this.roles)if(this.roles[c]===a.roles[b])return!0;return!1};this.validateMenuExistance=function(a){if(a&&a.length){if(this.menus[a])return!0;throw new Error("Menu does not exists")}throw new Error("MenuId was not provided")},this.getMenu=function(a){return this.validateMenuExistance(a),this.menus[a]},this.addMenu=function(b,c,d){return this.menus[b]={isPublic:c||!1,roles:d||this.defaultRoles,items:[],shouldRender:a},this.menus[b]},this.removeMenu=function(a){this.validateMenuExistance(a),delete this.menus[a]},this.addMenuItem=function(b,c,d,e,f,g,h,i){return this.validateMenuExistance(b),this.menus[b].items.push({title:c,link:d,menuItemType:e||"item",menuItemClass:e,uiRoute:f||"/"+d,isPublic:null===g||"undefined"==typeof g?this.menus[b].isPublic:g,roles:null===h||"undefined"==typeof h?this.menus[b].roles:h,position:i||0,items:[],shouldRender:a}),this.menus[b]},this.addSubMenuItem=function(b,c,d,e,f,g,h,i){this.validateMenuExistance(b);for(var j in this.menus[b].items)this.menus[b].items[j].link===c&&this.menus[b].items[j].items.push({title:d,link:e,uiRoute:f||"/"+e,isPublic:null===g||"undefined"==typeof g?this.menus[b].items[j].isPublic:g,roles:null===h||"undefined"==typeof h?this.menus[b].items[j].roles:h,position:i||0,shouldRender:a});return this.menus[b]},this.removeMenuItem=function(a,b){this.validateMenuExistance(a);for(var c in this.menus[a].items)this.menus[a].items[c].link===b&&this.menus[a].items.splice(c,1);return this.menus[a]},this.removeSubMenuItem=function(a,b){this.validateMenuExistance(a);for(var c in this.menus[a].items)for(var d in this.menus[a].items[c].items)this.menus[a].items[c].items[d].link===b&&this.menus[a].items[c].items.splice(d,1);return this.menus[a]},this.addMenu("topbar")}]),angular.module("licenses").config(["$stateProvider",function(a){a.state("listLicenses",{url:"/licenses",templateUrl:"modules/licenses/views/list-licenses.client.view.html"}).state("createLicense",{url:"/licenses/create",templateUrl:"modules/licenses/views/create-license.client.view.html"}).state("viewLicense",{url:"/licenses/:licenseId",templateUrl:"modules/licenses/views/view-license.client.view.html"}).state("editLicense",{url:"/licenses/:licenseId/edit",templateUrl:"modules/licenses/views/edit-license.client.view.html"})}]),angular.module("licenses",[]).service("licenseProperties",["Licenses","$q",function(a,b){return{create:function(c,d){var e=b.defer(),f=new a({name:c});f.$save(function(a){e.resolve(a)},function(){e.reject()});var g=e.promise;g.then(function(a){d(a)})}}}]),angular.module("licenses").controller("LicensesController",["$scope","$stateParams","$location","Authentication","Licenses",function(a,b,c,d,e){a.authentication=d,a.create=function(){var b=new e({name:this.name});b.$save(function(b){c.path("licenses/"+b._id),a.name=""},function(b){a.error=b.data.message})},a.remove=function(b){if(b){b.$remove();for(var d in a.licenses)a.licenses[d]===b&&a.licenses.splice(d,1)}else a.license.$remove(function(){c.path("licenses")})},a.update=function(){var b=a.license;b.$update(function(){c.path("licenses/"+b._id)},function(b){a.error=b.data.message})},a.find=function(){a.licenses=e.query()},a.findOne=function(){a.license=e.get({licenseId:b.licenseId})}}]),angular.module("licenses").factory("Licenses",["$resource",function(a){return a("licenses/:licenseId",{licenseId:"@_id"},{update:{method:"PUT"}})}]),angular.module("organizations").config(["$stateProvider",function(a){a.state("listOrganizations",{url:"/organizations",templateUrl:"modules/organizations/views/list-organizations.client.view.html"}).state("createOrganization",{url:"/organizations/create",templateUrl:"modules/organizations/views/create-organization.client.view.html"}).state("viewOrganization",{url:"/organizations/:organizationId",templateUrl:"modules/organizations/views/view-organization.client.view.html"}).state("editOrganization",{url:"/organizations/:organizationId/edit",templateUrl:"modules/organizations/views/edit-organization.client.view.html"})}]);var app=angular.module("organizations",["angularFileUpload"]);app.service("sharedProperties",["Organizations","$q","$stateParams",function(a,b){var c=a.query();return{create:function(c,d){var e=b.defer(),f=new a({name:c});f.$save(function(a){e.resolve(a)},function(){e.reject()});var g=e.promise;g.then(function(a){d(a)})},orgLength:function(){return c},findOne:function(){var b=a.get({organizationId:$scope.authentication.user.orgId});return b}}}]),app.directive("file",function(){return{$scope:{file:"="},link:function(a,b){b.bind("change",function(b){var c=b.target.files[0];a.file=c?c:void 0,a.$apply()})}}}),app.controller("OrganizationsController",["$scope","$stateParams","$location","Authentication","Organizations","$http","$upload",function(a,b,c,d,e,f,g){a.authentication=d,a.AllCompanyNames=e.query(),a.create=function(b){var c=new e({name:b});return c.$save(function(){},function(b){a.error=b.data.message}),response._id},a.remove=function(b){if(b){b.$remove();for(var d in a.organizations)a.organizations[d]===b&&a.organizations.splice(d,1)}else a.organization.$remove(function(){c.path("organizations")})},a.update=function(){var b=a.organization;b.$update(function(){c.path("organizations/"+b._id)},function(b){a.error=b.data.message})},a.find=function(){a.organizations=e.query()},a.findOne=function(){a.organization=e.get({organizationId:b.organizationId})},a.onDropSelect=function(b){a.selectedFiles=[];for(var c=0;c<b.length;c++)a.selectedFiles=b[c];console.log(" $scope.selectedFiles: %j",a.selectedFiles)},a.updateSth=function(){a.cname2=a.Orglist.name,console.log(" $scope.cname2 ---",+a.cname2),f({method:"POST",url:"/upload",headers:{"Content-Type":"multipart/form-data"},data:{name:a.cname2,file:a.file,dropfile:a.selectedFiles},transformRequest:function(a,b){var c=new FormData;angular.forEach(a,function(a,b){c.append(b,a),console.log("key---->"+b),console.log("value",a)});var d=b();return delete d["Content-Type"],c}})},a.files=[],a.setFiles=function(b){a.$apply(function(a){console.log("fields:",b.fields);for(var c=0;c<b.files.length;c++)a.files.push(b.files[c]);a.progressVisible=!1,console.log("$scope.cname1: "+a.cname),console.log("$scope.file: %j",a.file)})},a.onFileSelect=function(){var b=new FormData;for(var c in a.files)b.append("uploadedFile",a.files[c]);var d=a.files;return console.log("image:",d),angular.isArray(d)&&(d=d[0]),angular.forEach(d[0],function(a,b){console.log(b+" $scope.files--> "+a)}),"image/png"!==d.type&&"image/jpeg"!==d.type?void alert("Only PNG and JPEG are accepted."):(a.uploadInProgress=!0,a.uploadProgress=0,a.upload=g.upload({url:"/upload",method:"POST",file:d,field:a.cname}).progress(function(b){a.progressVisible=!0,a.uploadProgress=Math.floor(b.loaded/b.total),a.progress=Math.round(100*b.loaded/b.total),a.$apply()}).success(function(){a.progressVisible=!0,a.uploadInProgress=!1}).error(function(b){alert("failed"),a.uploadInProgress=!1,console.log("Error uploading file: "+b.message||b)}),void(a.upload=""))}}]),angular.module("organizations").factory("Organizations",["$resource",function(a){return a("organizations/:organizationId",{organizationId:"@_id"},{update:{method:"PUT"}})}]),angular.module("roles").config(["$stateProvider",function(a){a.state("listRoles",{url:"/roles",templateUrl:"modules/roles/views/list-roles.client.view.html"}).state("createRole",{url:"/roles/create",templateUrl:"modules/roles/views/create-role.client.view.html"}).state("viewRole",{url:"/roles/:roleId",templateUrl:"modules/roles/views/view-role.client.view.html"}).state("editRole",{url:"/roles/:roleId/edit",templateUrl:"modules/roles/views/edit-role.client.view.html"})}]),angular.module("roles",[]).service("rolesProperties",["Roles",function(a){var b=a.query();return{all:function(){return b},first:function(){return b[0]}}}]),angular.module("roles").controller("RolesCreateController",["$scope","$stateParams","$location","Roles",function(a,b,c,d){a.create=function(){var b=new d({name:this.name});b.$save(function(){a.name="",alert("Role is Created"),c.path("/superadminindexpage")},function(b){a.error=b.data.message})}}]),angular.module("roles").controller("RolesController",["$scope","$stateParams","$location","Authentication","Roles",function(a,b,c,d,e){a.create=function(){var b=new e({name:this.name});b.$save(function(b){c.path("roles/"+b._id),a.name=""},function(b){a.error=b.data.message})},a.remove=function(b){if(b){b.$remove();for(var d in a.roles)a.roles[d]===b&&a.roles.splice(d,1)}else a.role.$remove(function(){c.path("roles")})},a.update=function(){var b=a.role;b.$update(function(){c.path("roles/"+b._id)},function(b){a.error=b.data.message})},a.find=function(){a.roles=e.query()},a.findOne=function(){a.role=e.get({roleId:b.roleId})}}]),angular.module("roles").factory("Roles",["$resource",function(a){return a("roles/:roleId",{roleId:"@_id"},{update:{method:"PUT"}})}]),angular.module("users").config(["$httpProvider",function(a){a.interceptors.push(["$q","$location","Authentication",function(a,b,c){return{responseError:function(d){switch(d.status){case 401:c.user=null,b.path("signin");break;case 403:}return a.reject(d)}}}])}]),angular.module("users").config(["$stateProvider",function(a){a.state("profile",{url:"/settings/profile",templateUrl:"modules/users/views/settings/edit-profile.client.view.html"}).state("password",{url:"/settings/password",templateUrl:"modules/users/views/settings/change-password.client.view.html"}).state("accounts",{url:"/settings/accounts",templateUrl:"modules/users/views/settings/social-accounts.client.view.html"}).state("signup",{url:"/signup",templateUrl:"modules/users/views/authentication/signup.client.view.html"}).state("signin",{url:"/signin",templateUrl:"modules/users/views/authentication/signin.client.view.html"}).state("forgot",{url:"/password/forgot",templateUrl:"modules/users/views/password/forgot-password.client.view.html"}).state("reset-invlaid",{url:"/password/reset/invalid",templateUrl:"modules/users/views/password/reset-password-invalid.client.view.html"}).state("reset-success",{url:"/password/reset/success",templateUrl:"modules/users/views/password/reset-password-success.client.view.html"}).state("reset",{url:"/password/reset/:token",templateUrl:"modules/users/views/password/reset-password.client.view.html"})}]);var app=angular.module("users",[]);app.controller("AuthenticationController",["$scope","$http","$location","Authentication","sharedProperties","Users","$stateParams","licenseProperties","rolesProperties",function(a,b,c,d,e,f,g,h,i){a.authentication=d,a.GlobalRoles=i.all(),a.GlobalUsers=f.query(),a.GlobalOrganizations=e.orgLength(),a.LogoName="invoice.png",a.find=function(){a.users=a.GlobalUsers,a.onlyUsers=[],angular.forEach(a.users,function(b){angular.forEach(b,function(c,d){"orgId"==d&&c==a.authentication.user.orgId&&a.onlyusers.push(b)})}),console.log("$scope.onlyusers = "+a.onlyUsers),console.log("$scope.authentication.user.orgId = "+a.authentication.user.orgId),a.gridOptions={data:"onlyUsers",enablePaging:!0,showFooter:!0,totalServerItems:"totalServerItems",pagingOptions:a.pagingOptions,filterOptions:a.filterOptions,selectedItems:a.mySelections,multiSelect:!1}},a.signup=function(){a.credentials.role=a.credentials.newrole._id,null!=a.credentials.companyName&&""!=a.credentials.companyName?(null!=a.credentials.licenses&&""!=a.credentials.licenses&&(console.log(" if $scope.credentials-->"+a.credentials),h.create(a.credentials.licenses,function(a){angular.forEach(a,function(){})})),e.create(a.credentials.companyName,function(b){angular.forEach(b,function(b,c){"_id"==c&&a.assingValue(b)})})):(a.credentials.orgId=a.authentication.user.orgId,a.length=0,angular.forEach(a.GlobalUsers,function(b){angular.forEach(b,function(b,c){"orgId"==c&&b==a.authentication.user.orgId&&a.length++})}),a.authentication.user.licenses>a.length?b.post("/auth/signup",a.credentials).success(function(){c.path("/adminindexpage")}).error(function(b){a.error=b.message}):(alert("sorry!. Your Licenses are over"),a.credentials=""))},a.assingValue=function(d){a.credentials.orgId=d,b.post("/auth/signup",a.credentials).success(function(b){a.authentication.user=b,c.path("/superadminindexpage")}).error(function(b){a.error=b.message})},a.signin=function(){b.post("/auth/signin",a.credentials).success(function(b){a.authentication.user=b,a.signinuser=a.authentication.user,a.userRole=a.authentication.user.role,angular.forEach(a.GlobalRoles,function(b){angular.forEach(b,function(d,e){if("_id"==e&&d==a.userRole)switch(b.name){case"superAdmin":c.path("/superadminindexpage");break;case"Admin":c.path("/adminindexpage");break;case"admin":c.path("/adminindexpage");break;case"user":c.path("/userhome");break;default:c.path("/userhome")}})})}).error(function(b){a.error=b.message}),angular.forEach(a.signinuser,function(a,b){console.log(b+"signinuserinside-->"+a)})}}]),angular.module("users").controller("PasswordController",["$scope","$stateParams","$http","$location","Authentication",function(a,b,c,d,e){a.authentication=e,a.authentication.user&&d.path("/"),a.askForPasswordReset=function(){a.success=a.error=null,c.post("/auth/forgot",a.credentials).success(function(b){a.credentials=null,a.success=b.message}).error(function(b){a.credentials=null,a.error=b.message})},a.resetUserPassword=function(){a.success=a.error=null,c.post("/auth/reset/"+b.token,a.passwordDetails).success(function(b){a.passwordDetails=null,e.user=b,d.path("/password/reset/success")}).error(function(b){a.error=b.message})}}]),angular.module("users").controller("SettingsController",["$scope","$http","$location","Users","Authentication",function(a,b,c,d,e){a.user=e.user,a.user||c.path("/"),a.hasConnectedAdditionalSocialAccounts=function(){for(var b in a.user.additionalProvidersData)return!0;return!1},a.isConnectedSocialAccount=function(b){return a.user.provider===b||a.user.additionalProvidersData&&a.user.additionalProvidersData[b]},a.removeUserSocialAccount=function(c){a.success=a.error=null,b.delete("/users/accounts",{params:{provider:c}}).success(function(b){a.success=!0,a.user=e.user=b}).error(function(b){a.error=b.message})},a.updateUserProfile=function(b){if(b){a.success=a.error=null;var c=new d(a.user);c.$update(function(b){a.success=!0,e.user=b},function(b){a.error=b.data.message})}else a.submitted=!0},a.changeUserPassword=function(){a.success=a.error=null,b.post("/users/password",a.passwordDetails).success(function(){a.success=!0,a.passwordDetails=null}).error(function(b){a.error=b.message})}}]),angular.module("users").factory("Authentication",[function(){var a=this;return a._data={user:window.user},a._data}]),angular.module("users").factory("Users",["$resource",function(a){return a("users",{},{update:{method:"PUT"}})}]);