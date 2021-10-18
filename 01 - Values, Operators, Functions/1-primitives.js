
// Variables and constants
//  - variables declared with 'let'
//  - constants declared with 'const'
//  - if unsure, choose 'const'
//  - variables and constants are untyped
//     -- but all values have a type

// Types
//  - examples of main primitive values
//     -- number   # no distinction between integers and floats
//     -- string   # declared between '...', "...", or `...`
//     -- boolean  # false / true 
//     -- null     # a special value of type object

const m = 3;       console.log(m, '(', typeof m, ')');
const n = 4.56;    console.log(n, '(', typeof n, ')');

const s = "abc";   console.log(s, '(', typeof s, ')');
const t = 'def';   console.log(t, '(', typeof t, ')');

let b = true;      console.log(b, '(', typeof b, ')');
b = 0.01;          console.log(b, '(', typeof b, ')');

const z = null;    console.log(z, '(', typeof z, ')');

// Functions
//  - no types for arguments and return value
//  - behaviour depends on the runtime types

function sum(x, y) {
	return x + y;
}

const r1 = sum(m, n);
const r2 = sum(s, t);

console.log(r1);
console.log(r2);
