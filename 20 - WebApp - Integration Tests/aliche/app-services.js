'use strict';

const errors = require('./app-errors.js');

module.exports = function (data_ext, data_int) {

	async function getUsername(token) {
		if (!token) {
			throw errors.UNAUTHENTICATED('no token');
		}
		const username = await data_int.tokenToUsername(token);
		if (!username) {
			throw errors.UNAUTHENTICATED('bad token');
		}
		return username;
	}

  async function searchBook(query) {
		if (!query) {
			throw errors.MISSING_PARAM('query');
		}
		const book = await data_ext.findBook(query);
		return { book };
	}

	async function addBook(token, bookIdArg) {
		if (!bookIdArg) {
			throw errors.MISSING_PARAM('bookId');
		}
		try {
			const username = await getUsername(token);
			if (await data_int.hasBook(username, bookIdArg)) {
				return { bookId: bookIdArg };
			}
			const book = await data_ext.getBookById(bookIdArg);
			const bookIdRes =
				await data_int.saveBook(username, book);
			return { bookId: bookIdRes };
		} catch (err) {
			if (err.name === 'NOT_FOUND') {
				throw errors.INVALID_PARAM({ bookId: bookIdArg, err });
			}
			throw err;
		}
	}

	async function getAllBooks(token) {
		const books = await data_int.listBooks(
			await getUsername(token)
		);
		return { books };
	}

	async function getBook(token, bookId) {
		const book = await data_int.loadBook(
			await getUsername(token), bookId
		);
		return { book };
	}

	async function delBook(token, bookIdArg) {
		const bookId = await data_int.deleteBook(
			await getUsername(token), bookIdArg
		);
		return { bookId };
	}

	return {
		searchBook,
		addBook,
		getBook,
		delBook,
		getAllBooks
	};
}
