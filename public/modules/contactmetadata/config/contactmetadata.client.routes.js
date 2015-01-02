'use strict';

//Setting up route
angular.module('contactmetadata').config(['$stateProvider',
	function($stateProvider) {
		// Contactmetadata state routing
		$stateProvider.
		state('listContactmetadata', {
			url: '/contactmetadata',
			templateUrl: 'modules/contactmetadata/views/list-contactmetadata.client.view.html'
		}).
		state('createContactmetadatumnew', {
			url: '/contactmetadata/create',
			templateUrl: 'modules/contactmetadata/views/create-contactmetadatum.client.view.html'
		}).
		state('viewContactmetadatum', {
			url: '/contactmetadata/:contactmetadatumId',
			templateUrl: 'modules/contactmetadata/views/view-contactmetadatum.client.view.html'
		}).
		state('editContactmetadatum', {
			url: '/contactmetadata/:contactmetadatumId/edit',
			templateUrl: 'modules/contactmetadata/views/edit-contactmetadatum.client.view.html'
		});
	}
]);