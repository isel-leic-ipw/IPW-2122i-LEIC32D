'use strict';

const fs = require('fs');

fs.appendFileWithPromises = function (path, data) {
	return new Promise((resolve, reject) => {
		fs.appendFile(path, data, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

fs.appendFileWithPromises(
	'./output.txt',
	`${new Date()}\n`
)
.then(() => { console.log('[1]', 'DONE'); })
.catch(err => { console.log('[1]', 'FAIL', err); });


fs.appendFileWithPromises(
	'./?*?.txt',
	`${new Date()}\n`
)
.then(() => { console.log('[2]', 'DONE'); })
.catch(err => { console.log('[2]', 'FAIL', err); });

console.log(':: end of code ::');







