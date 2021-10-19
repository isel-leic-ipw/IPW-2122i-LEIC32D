'use strict';

console.log(':: starting ::');

setTimeout(function () {
	console.log('>> A');
	setTimeout(() => console.log('>> R'), 1000);
	console.log('>> X');
}, 3000);

setTimeout(function () {
	console.log('>> B');
	setTimeout(() => console.log('>> S'), 3000);
	console.log('>> Y');
}, 2000);

setTimeout(function () {
	console.log('>> C');
	setTimeout(() => console.log('>> T'), 1500);
	console.log('>> Z');
}, 1000);

console.log(':: finishing ::');