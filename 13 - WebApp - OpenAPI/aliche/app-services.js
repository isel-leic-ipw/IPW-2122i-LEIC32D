'use strict';

module.exports = function (data_ext, data_int) {

	async function addBook(bookId) {
		const book = await data_ext.getBookById(bookId);
		return data_int.saveBook(book);
	}

	async function getAllBooks() {
		const books = await data_int.listBooks();
		return { books };
	}

	return {
		searchBook: data_ext.findBook,
		addBook,
		getBook: data_int.loadBook,
		delBook: data_int.deleteBook,
		getAllBooks
	};
}
