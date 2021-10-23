'use strict';

const fetch = require('node-fetch');

fetch('https://loripsum.net/api/1/short/plaintext') // p1
	.then(res => {
		console.log(res.status, res.statusText);
		return res.text(); // p5
	}) // p2
	.then(txt => {
		console.log(txt); // request body text
	}) // p3
	.catch(err => {
		console.log(err);
	}) // p4
