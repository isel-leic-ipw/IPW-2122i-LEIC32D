'use strict';

const filename = process.argv[2] || './output.txt';

const fsp = require('fs/promises');
const fetch = require('node-fetch');

fetch('https://loripsum.net/api/1/short/plaintext') // p1
	.then(res => {
		console.log(res.status, res.statusText);
		return res.text(); // p6
	}) // p2
	.then(txt => {
		console.log(txt); // request body text
		return fsp.appendFile(filename, txt); // p7
	}) // p3
	.then(() => {
		console.log("written to file");
	}) // p4
	.catch(err => {
		console.log(err);
	}) // p5
