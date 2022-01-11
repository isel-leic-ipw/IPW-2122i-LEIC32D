'use strict';

const errors = require('./app-errors');

module.exports = function (guest) {

	const user_list = require('./app-data-int-users')(guest);
	const users  = user_list.users;
	const tokens = user_list.tokens;
	const books  = Object.values(users).reduce((books, user) => {
		books[user.username] = {};	return books;
	}, {});

	function checkUser(username) {
		if (!users[username]) {
			throw errors.UNAUTHENTICATED(username);
		}
	}

	const hasBook =
		async (username, bookId) =>
			!!books[username][bookId];

	async function saveBook(username, bookObj) {
		const bookId = bookObj.id;
		books[username][bookId] = bookObj;
		return bookId;
	}

	async function loadBook(username, bookId) {
		const bookObj = books[username][bookId];
		if (!bookObj) {
			const err = errors.NOT_FOUND({ id: bookId })
			throw err;
		}
		return bookObj;
	}

	async function deleteBook(username, bookId) {
		const bookObj = books[username][bookId];
		if (!bookObj) {
			throw errors.NOT_FOUND({ id: bookId });
		}
		delete books[username][bookId];
		return bookId;
	}

	async function deleteAllBooks() {
		Object.keys(books).forEach(username => {
			books[username] = {};
		});
	}

	async function listBooks(username) {
		return Object.values(books[username]);
	}

	async function tokenToUsername(token) {
		return tokens[token];
	}

	async function getUser(username) {
		checkUser(username);
		return users[username];
	}

	return {
		hasBook,
		saveBook,
		loadBook,
		deleteBook,
		deleteAllBooks,
		listBooks,
		tokenToUsername,
		getUser
	};
};
