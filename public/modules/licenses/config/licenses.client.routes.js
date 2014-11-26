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