'use strict';

const errors = require('./app-errors');

const fetch = require('node-fetch');

const GOOGLE_BOOKS_BASE_URI =
	'https://www.googleapis.com/books/v1/volumes';

const HTTP_SERVER_ERROR = 5;

function getStatusClass(statusCode) {
	return ~~(statusCode / 100);
}

function do_fetch(uri) {
	return fetch(uri)
		.catch (err => { throw errors.EXT_SVC_FAIL(err); })
		.then(res => {
			if (res.ok) {
				return res.json();
			} else {
				if (res.status === 404) {
					throw errors.NOT_FOUND(uri);
				}
				if (getStatusClass(res.status) === HTTP_SERVER_ERROR) {
					return res.json()
						.catch (err => err) // can you see what this does?
						.then(info => { throw errors.EXT_SVC_FAIL(info); });
				} else {
					throw errors.FAIL(res); 
				}
			}
		});
}

function findId(info, type) {
	return info.industryIdentifiers &&
		info.industryIdentifiers
		.filter(iid => iid.type === type)
		.map(iid => iid.identifier)
		.concat(undefined)[0];
}

function makeBookObj(bookInfo) {
	return {
		id: bookInfo.id,
		title: bookInfo.volumeInfo.title,
		authors: bookInfo.volumeInfo.authors,
		publisher: bookInfo.volumeInfo.publisher,
		publishedDate: bookInfo.volumeInfo.publishedDate,
		language: bookInfo.volumeInfo.language,
		isbn10: findId(bookInfo.volumeInfo, "ISBN_10"),
		isbn13: findId(bookInfo.volumeInfo, "ISBN_13"),
	};	
}

function findBook(query) {
	const search_uri =
		GOOGLE_BOOKS_BASE_URI + '?q=' + query;

	return do_fetch(search_uri)
		.then(answer => {
			if (answer.items && answer.items.length) {
				//return makeBookObj(answer.items[0]);
				return getBookById(answer.items[0].id);
			} else {
				throw errors.NOT_FOUND({ query });
			}
		});
}

function getBookById(id) {
	const book_uri =
		GOOGLE_BOOKS_BASE_URI + '/' + id;
	
	return do_fetch(book_uri).then(makeBookObj);
}

module.exports = {
	findBook,
	getBookById
};
