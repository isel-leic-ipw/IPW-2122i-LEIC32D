'use strict';

const urllib = require('urllib');

function quote(done) {
	urllib.request('https://loripsum.net/api/1/short/plaintext', function (err, data, res) {
		if (err) {
			done(err)
		} else {
			done(null, { res, data: data.toString() });
		}
	});
}

module.exports = quote;
