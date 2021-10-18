'use strict';

function showTypeInfo(v) {
	const ctor = (v === undefined || v === null) ? '--' : v.constructor;
	console.log(v, " -> ", typeof v, "(", ctor, ")");
}

function f1(a, b) {
	return a + b;
}

const f2 = function (a, b) { return a + b; };

const f3 = (a, b) => a + b;

showTypeInfo(f1);
showTypeInfo(f2);
showTypeInfo(f3);

console.log('----');

console.log(f1(3, 4));
console.log(f2(3, 4));
console.log(f3(3, 4));

console.log('----');

const r = f1(3, 4);
const f = f1;
const s = f(5, 6);

console.log(r);
console.log(f);
console.log(s);

console.log('----');

showTypeInfo(function (a, b) { return a * b; });
showTypeInfo((a, b) => a * b);

const fx = function (a, b) { return a * b; };
const fy = (a, b) => a * b;

showTypeInfo(fx);
showTypeInfo(fy);

console.log('----');

function sum(a, b, c, d = 0) {
	const xc = ((c === undefined) ? 0 : c);
	const xb = b || 0;
	return a + xb + xc + d;
}

const r1 = sum(1, 2, 3);
const r2 = sum(1, 2);
const r3 = sum(1);
const r4 = sum(1, 2, 3, 4, 5, 6, 7, 8, 9);

console.log(r1);
console.log(r2);
console.log(r3);
console.log(r4);

console.log('----');

function fa(...args) {
	console.log('fa', arguments);
	console.log('fa', args);
}

fa();
fa(1);
fa('a', false);
fa([1, 2, 3], "ISEL", null);
