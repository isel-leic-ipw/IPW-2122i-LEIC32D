'use strict';

const quote = require('./quote.js');

test('no error', (done) => {
	quote((err, qt) => {
		try {
			expect(err).toBeNull();
			done();
		} catch (err) {
			done(err);
		}
	});
});
