'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');
	app.route('/').get(core.index);
	app.route('/superadminindexpage').get(core.index);
	app.route('/adminindexpage').get(core.index1);
	
};