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