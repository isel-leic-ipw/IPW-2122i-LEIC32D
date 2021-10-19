'use strict';

const items = [
	"IPL",
	"ISEL",
	"LEIC",
	"IPW",
	"LEIC32D"
];

const fs = require('fs');

const filename = process.argv[2] || './items.txt';

items.forEach(item => {
	console.log('>> writing:', item);
	fs.appendFile(filename, `${item}\n`, err => {
		if (err) {
			console.log(err);
		} else {
			console.log('>> written:', item);
		}
	}); 
});

console.log(':: !DONE ::');
