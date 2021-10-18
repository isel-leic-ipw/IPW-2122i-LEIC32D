
// Aggregates (arrays and objects)

// Arrays
//  - created with []
//  - untyped

const a = [0,1,2,3,4];
const b = ['a', true, null, 3, "abc", [0,1,2]];

console.log(a[1]);
console.log(b[4]);

console.log('------');

// Objects
//  - created with {}
//  - untyped named properties

const p = {
	a: 23,
	b: 56,
	c: "xyz"
};

console.log(p.b);
console.log(p.c);

console.log('------');

// Object properties accessible with [<name>] 

console.log(p['b']);
console.log(p['c']);

console.log('------');

// Iterating object properties and array indices

for (const v in p) {
	console.log(v, ': ', p[v]);
}

for (const v in b) {
	console.log(v, ': ', b[v]);
}

console.log('------');

// Array length and sparse arrays

console.log('length: ', b.length);

b[14] = 8;

// What is the new length? 7 or 15?
console.log('length: ', b.length);

// How many elements are there? 7 or 15?
for (const v in b) {
	console.log(v, ': ', b[v]);
}

console.log(b);
