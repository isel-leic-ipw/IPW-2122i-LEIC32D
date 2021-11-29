'use strict';

const books = {

		"E00FkgEACAAJ": {"id":"E00FkgEACAAJ","title":"Livro do desassossego","authors":["Fernando Pessoa","Richard Zenith"],"publishedDate":"2011","language":"pt-BR","isbn10":"8535919430","isbn13":"9788535919431"},

		"H-lbAAAAQAAJ": {"id":"H-lbAAAAQAAJ","title":"La divina commedia","authors":["Dante Alighieri"],"publishedDate":"1838","language":"it"}
};

const queries = {
	"livro+do+desassossego": "E00FkgEACAAJ",
	"la+divina+commedia": "H-lbAAAAQAAJ",
};

async function findBook(query) {
	const bookId = queries[query];
	return getBookById(bookId);
}

async function getBookById(bookId) {
	const book = bookId && books[bookId];
	if (!book) {
		throw errors.NOT_FOUND(bookId);
	}
	return book;
}

module.exports = {
	books,
	findBook,
	getBookById
};
