'use strict';

//Contactmetadata service used to communicate Contactmetadata REST endpoints
angular.module('contactmetadata').factory('Contactmetadata', ['$resource',
	function($resource) {
		return $resource('contactmetadata/:contactmetadatumId', { contactmetadatumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);