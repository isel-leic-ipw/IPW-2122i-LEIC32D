'use strict';

function func(...args) {
	console.log(
		"func called",
		"for this:", this,
		"and args:", args
	);
}

const obj = {
	x: 42,
	f: func
};

// for functions, 'this' is context-bound (object at call site)
func(1, 2, 3);
obj.f('a', 'b', 'c');

const anotherObj = {
	x: 'ISEL',
	y: 2021,
	f: func,
	p: function () {
		console.log(`{ x: ${this.x}, y: ${ this.y } }`)
	},
	q: () => {
		console.log(`{ x: ${this.x}, y: ${ this.y } }`)
	}
};

anotherObj.f();
anotherObj.p();
anotherObj.q();


// Constructor functions

function Point(a, b) {
	this.x = a;
	this.y = b;
	
	this.s = function () {
		console.log(`{ x: ${ this.x }, y: ${ this.y } }`);
	}
}

const p1 = new Point(3, 4);
const p2 = new Point(5, 6);

console.log(`p1 is an ${ typeof p1 } with ctor: `, p1.constructor);

console.log(p1);
console.log(p2);

p1.s();
p2.s();

Point.prototype.magnitude = function () {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

console.log(p1.magnitude());
console.log(p2.magnitude());

p1.x = 8;
console.log(p1.magnitude());


String.prototype.prepend = function (prefix) {
	return `${prefix}` + this; 
}

console.log("2021".prepend(" - ").prepend("ISEL"));

console.log('----');

console.log(typeof console.log);

const print = console.log;
const fff = func;

print.call(console, 'a', 1, true);
print.apply(console, ['a', 1, true]);

fff.call(null, 1, 2, 3);
fff.call(obj, 1, 2, 3);

fff.apply(null, [1, 2, 3]);
fff.apply(obj, [1, 2, 3]);

const func2 = func.bind({ x: 1, y: 2 });
func(1, 2, 3);
func2(1, 2, 3);

const obj3 = { f: func2 };
obj3.f(1, 2, 3);

print('bye');
