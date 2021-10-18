'use strict';

function showTypeInfo(v) {
	const ctor = (v === undefined || v === null) ? '--' : v.constructor;
	console.log(v, " -> ", typeof v, "(", ctor, ")");
}

let empty;

showTypeInfo(empty);
showTypeInfo(null);
showTypeInfo(true);
showTypeInfo(8);
showTypeInfo(123.456);
showTypeInfo('a');
showTypeInfo("ISEL");

const arr = [1, 2, 3, 4];
const obj = { a: 1, b: 2 };

console.log("arr.length: ", arr.length);

showTypeInfo(arr);
showTypeInfo(obj);

showTypeInfo(new Date());
