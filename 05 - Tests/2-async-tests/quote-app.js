'use strict';

const quote = require('./quote.js');

quote((err, qt) => {
	if (err) {
		console.log("!!! FAILED !!!");
		console.log(err);
	} else if (qt.res.statusCode !== 200) {
		console.log("!!! FAILED !!!");
		console.log(qt.data);
	} else {
		console.log(qt.data);
	}
});
