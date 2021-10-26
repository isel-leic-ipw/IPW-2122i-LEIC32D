'use strict';

const fetch = require('node-fetch');

function getWithExplicitPromises() {
	return fetch('https://loripsum.net/api/1/short/plaintext') // p1
		.then(res => {
			console.log(res.status, res.statusText);
			if (res.status === 200) {
				return res.text(); // p5
			} else {
				return Promise.reject(
					{ msg: "Invalid response", err: res }
				);
			}
		}) // p2
		.then(txt => {
			console.log(txt); // request body text
		}) // p3
		.catch(err => {
			console.log('[CATCH]', err);
		}) // p4
}

async function getWithAsyncAwait() {
	try {
		const res = await fetch(
			'https://loripsum.net/api/1/short/plaintext'
		);
		if (res.status === 200) {		
			console.log(res.status, res.statusText);
			const txt = await res.text();
			console.log(txt);
		} else {
			throw { msg: "Invalid response", err: res };
		}
	} catch (err) {
		console.log("[CATCH]", err);
	}
}

// As duas funções, embora sintaticamente muito diferentes,
// são estruturalmente equivalentes. Em getWithAsyncAwait
// existe a mesma cadeia de Promises, mas gerada
// automaticamente pelo interpretador a partir do código
// fonte com async/await.
//
getWithExplicitPromises();
// getWithAsyncAwait();
