'use strict';

const express = require('express');
const path = require('path');

module.exports = function (services, guest_token) {
	
	function getToken(req) {
		return guest_token; // to be improved...
	}
	
	function getHomepage(req, res) {
		res.render('home');
	} 

	function getSearchPage(req, res) {
		res.render('search');
	} 

	async function findInLibrary(req, res) {
		const query = req.query.q;
		try {
			const bookRes = await services.searchBook(query);
			const book = bookRes.book;
			res.render('book', { query, book });
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					res.status(400).render(
						'book',
						{ error: 'no query provided'}
					);
					break;
				case 'NOT_FOUND':
					res.status(404).render(
						'book',
						{ query, error: 'no book found for this query'}
					);
					break;
				default:
					res.status(500).render(
						'book',
						{ query, error: JSON.stringify(err)}
					);
					break;
			}
		}
	}
	
	async function listSavedBooks(req, res) {
		try {
			const booksRes = await services.getAllBooks(getToken(req));
			const books = booksRes.books;
			res.render('list', { books });
		} catch (err) {
			res.status(500).render(
				'list',
				{ error: JSON.stringify(err) }
			);
		}
	}

	const router = express.Router();
	
	// Homepage
	router.get('/', getHomepage);
	
	// Search page
	router.get('/search', getSearchPage);

	// Find in library
	router.get('/library', findInLibrary);
	
	// List saved books
	router.get('/list', listSavedBooks);

	return router;
};
