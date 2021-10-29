'use strict';

const fetch = require('node-fetch');

function getResponseSize(url) {
	return fetch(url)
		.then(res => {
			const contentLength = Number(res.headers.get('Content-Length'));
			return contentLength || res.text().then(txt => txt.length);
		})
}

function getTotalResponsesSize(...urls) {
	
}

console.time('sizes');
getTotalResponsesSize(
	'http://loripsum.net/api/1/short/plaintext',
	'https://www.google.com',
	'https://www.isel.pt',
	'https://www.microsoft.com',
	'https://www.publico.pt',
	'https://www.dn.pt',
	'https://www.sapo.pt',
)
.then(console.log)
.then(() => { console.timeEnd('sizes'); });
