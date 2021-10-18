'use strict';

// First-class functions: functions as values

const fsum1 = function (a, b) { return a + b; }; // anonymous function

const fsum2 = (a, b) => a + b;                   // arrow function


// High-Order Functions: take functions as arguments and/or return functions

function operate(xs, ys, operation) {
	const lastIdx = Math.min(xs.length, ys.length) - 1;
	
	const op = idx => idx < 0 ? [] :
		op(idx - 1).concat(
		    operation(xs[idx], ys[idx])
		);
	
	return op(lastIdx);
}

console.log(
	operate(
		[1, 2, 3],
		[9, 8, 7, 6, 5, 4],
		(a, b) => a + b
	)
);

console.log(
	operate(
		[],
		[9, 8, 7, 6, 5, 4],
		(a, b) => a + b
	)
);

console.log(
	operate(
		[],
		[],
		(a, b) => a + b
	)
);

console.log(
	operate(
		[1, 2, 3],
		[9, 8, 7, 6, 5, 4],
		(a, b) => a * b
	)
);

function mkfilter(refValue, comparator) {
	return value => comparator(value, refValue);
}

const lessThan3 = mkfilter(3, (v, r) => v < r);

console.log("1 < 3 ? ", lessThan3(1));
console.log("7 < 3 ? ", lessThan3(7));


// Functional Array methods

const vals = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(vals.map(x => x * 2));
console.log(vals.filter(lessThan3));
console.log(vals.find(x => x > 2 && x % 2 === 0));
console.log(vals.every(x => x < 10));
console.log(vals.some(x => x % 11 === 0));
console.log(vals.reduce((x, y) => x + y));
console.log(vals.reduce((x, y) => x.toString() + y.toString()));
console.log(vals.reduce((x, y) => x * y));
