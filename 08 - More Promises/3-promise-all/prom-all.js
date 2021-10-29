'use strict';

const fetch = require('node-fetch');

function getParagraph() {
	return fetch(
		'http://loripsum.net/api/1/short/plaintext'
	)
	.then(res => {
		if (res.ok) {
			return res.text();
		} else {
			return Promise.reject({
				msg: 'Error getting paragraph',
				err: res
			});
		}
	})
	.then(txt => txt.substr(57));
}

async function getNParagraphs1(n) {
	const ppp = new Array(n);
	for (let i = 0; i < n; ++i) {
		ppp[i] = await getParagraph();
	}
	return ppp;
}

async function getNParagraphs2(n) {
	const ppp = new Array(n);
	for (let i = 0; i < n; ++i) {
		ppp[i] = getParagraph();
	}
	return Promise.all(ppp);
}

getNParagraphs2(10).then(console.log);
