'use strict';

function proc1(arr, propName, func, initial) {
	return arr.reduce((ctx, item) => {
		if (item[propName] !== undefined) {
			return func(ctx, item);
		}
		return ctx;
	}, initial);
}

module.exports = proc1;
