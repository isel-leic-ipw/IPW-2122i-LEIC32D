'use strict';

const errors = require('./app-errors');

module.exports = function (guest_user, guest_token) {

	const users = {
		'jtrindade':  { books: {} },
		'fpessoa':    { books: {} },
		[guest_user]: { books: {} },
	};

	const tokens = {
		'4chwViN4QHCTyTnUud88ww': 'jtrindade',
		'cEzwXhDATtaaI5ZAO9PfYA': 'fpessoa',
		[guest_token]: guest_user
	};

	const hasBook =
		async (username, bookId) =>
			!!users[username].books[bookId];

	async function saveBook(username, bookObj) {
		const bookId = bookObj.id;
		users[username].books[bookId] = bookObj;
		return bookId;
	}

	async function loadBook(username, bookId) {
		const bookObj = users[username].books[bookId];
		if (!bookObj) {
			const err = errors.NOT_FOUND({ id: bookId })
			throw err;
		}
		return bookObj;
	}

	async function deleteBook(username, bookId) {
		const bookObj = users[username].books[bookId];
		if (!bookObj) {
			throw errors.NOT_FOUND({ id: bookId });
		}
		delete users[username].books[bookId];
		return bookId;
	}

	async function deleteAllBooks() {
		Object.values(users).forEach(user => {
			user.books = {};
		});
	}

	async function listBooks(username) {
		return Object.values(users[username].books);
	}

	async function tokenToUsername(token) {
		return tokens[token];
	}

	return {
		hasBook,
		saveBook,
		loadBook,
		deleteBook,
		deleteAllBooks,
		listBooks,
		tokenToUsername
	};
};
