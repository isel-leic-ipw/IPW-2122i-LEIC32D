'use strict';

// WARNING: This demo uses a fixed list of users.
// A real application should use a database to keep the user list.

module.exports = function (guest) {

	// TO DO: move to database
	const users = {
		'admin' : { username: 'admin', password: 'admin', token: '4chwViN4QHCTyTnUud88ww' },
		'isel'  : { username: 'isel',  password: 'ipw',   token: 'cEzwXhDATtaaI5ZAO9PfYA' },
		[guest.username] : guest
	};

	// TO DO: move to database
	const tokens = Object.values(users).reduce((toks, user) => {
		toks[user.token] = user.username;	return toks;
	}, {});

	return {
		users,
		tokens
	};
};
