'use strict';

function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}

function run1() {
	console.log('Going to sleep...');
	sleep(4000).then(() => { console.log('DONE'); });
}

async function run2() {
	console.log('Going to sleep...');
	await sleep(4000);
	console.log('DONE');
}

async function run3wrong() {
	console.log('Going to sleep...');
	sleep(4000);
	console.log('DONE');
}

run3wrong();

console.log(':: end of code ::');
