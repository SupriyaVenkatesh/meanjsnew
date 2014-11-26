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