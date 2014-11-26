'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
console.log('came inside index');
console.log('came inside index req---',req);

	res.render('index', {
		user: req.user || null
	});
};
exports.index1 = function(req, res) {
console.log('came inside');
console.log('req = ',req);
	//res.render('index1');
};