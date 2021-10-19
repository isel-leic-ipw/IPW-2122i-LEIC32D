'use strict';

const urllib = require('urllib');

urllib.request(
	'https://loripsum.net/api/1/short/plaintext',
	function (err, data, res) {
		if (err) {
			console.log('Failed to get a quote');
			console.log(err);
		} else {
			console.log(res);
			console.log('-----');
			console.log(data.toString());
		}
	}
);

console.log(":: REQUEST FINISHED AND PROPERLY DISPLAYED ::");
