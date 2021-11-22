'use strict';

const errors = require('./app-errors.js');

module.exports = function (data_ext, data_int) {

  async function searchBook(query) {
		if (!query) {
			throw errors.MISSING_PARAM('query');
		}
		const book = await data_ext.findBook(query);
		return { book };
	}

	async function addBook(bookIdArg) {
		if (!bookIdArg) {
			throw errors.MISSING_PARAM('bookId');
		}
		try {
			const book = await data_ext.getBookById(bookIdArg);
			const bookIdRes = await data_int.saveBook(book);
			return { bookId: bookIdRes };
		} catch (err) {
			if (err.name === 'NOT_FOUND') {
				throw errors.INVALID_PARAM({ bookId: bookIdArg, err });
			}
			throw err;
		}
	}

	async function getAllBooks() {
		const books = await data_int.listBooks();
		return { books };
	}

	async function getBook(bookId) {
		const book = await data_int.loadBook(bookId);
		return { book };
	}

	async function delBook(bookIdArg) {
		const bookId = await data_int.deleteBook(bookIdArg);
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
