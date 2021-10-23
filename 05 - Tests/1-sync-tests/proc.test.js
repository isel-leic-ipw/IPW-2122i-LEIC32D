'use strict';

const proc = require('./proc');

test('proc [] with initial 0', () => {
	// Arrange
	const arr = [];
	const prop = 'value';
	const ctx = 0;
	
	// Act
	const res = proc(arr, prop, (c,i) => c+1, ctx)
	
	// Assert
	expect(res).toBe(0);
});

test('proc [] with initial []', () => {
	// Arrange
	const arr = [];
	const prop = 'value';
	const ctx = [];
	
	// Act
	const res = proc(arr, prop, (c,i) => c.concat(i), ctx)
	
	// Assert
	expect(res).toEqual([]);
});

test('proc [3 valid objs] with initial 0', () => {
	// Arrange
	const arr = [{value:0},{x:'a',value:1},{value:2,n:0}];
	const prop = 'value';
	const ctx = 0;
	
	// Act
	const res = proc(arr, prop, (c,i) => c+1, ctx);
	
	// Assert
	expect(res).toBe(3);
});

test('proc [3 valid objs] with initial []', () => {
	// Arrange
	const arr = [{value:0},{x:'a',value:1},{value:2,n:0}];
	const prop = 'value';
	const ctx = [];
	
	// Act
	const res = proc(arr, prop, (c,i) => c.concat(i), ctx);
	
	// Assert
	expect(res).toEqual(arr);
});

test('proc [2 valid objs in 5] with initial []', () => {
	// Arrange
	const arr = [{value:0},{x:'a'},{x:'a',value:1},{},{values:[1, 2, 3],n:0}];
	const prop = 'value';
	const ctx = [];
	const expectedRes = [{value:0},{x:'a',value:1}];
	
	// Act
	const res = proc(arr, prop, (c,i) => c.concat(i), ctx);
	
	// Assert
	expect(res).toEqual(expectedRes);
});
