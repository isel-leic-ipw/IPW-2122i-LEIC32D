'use strict';

const errors = require('./app-errors');

const books = {};

const hasBook = async (bookId) => !!books[bookId];

async function saveBook(bookObj) {
	const bookId = bookObj.id;
	books[bookId] = bookObj;
	return bookId;
}

async function loadBook(bookId) {
	const bookObj = books[bookId];
	if (!bookObj) {
		throw errors.NOT_FOUND({ id: bookId });
	}
	return bookObj;
}

async function deleteBook(bookId) {
	const bookObj = books[bookId];
	if (!bookObj) {
		throw errors.NOT_FOUND({ id: bookId });
	}
	delete books[bookId];
	return bookId;
}

async function listBooks() {
	return Object.values(books);
}

module.exports = {
	hasBook,
	saveBook,
	loadBook,
	deleteBook,
	listBooks
};
