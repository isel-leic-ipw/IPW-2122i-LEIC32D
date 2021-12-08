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
		const header = 'Find Book Result';
		const query = req.query.q;
		try {
			const bookRes = await services.searchBook(query);
			const book = bookRes.book;
			res.render('book', { header, query, book });
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					res.status(400).render(
						'book',
						{ header, error: 'no query provided' }
					);
					break;
				case 'NOT_FOUND':
					res.status(404).render(
						'book',
						{ header, query, error: 'no book found for this query' }
					);
					break;
				default:
					res.status(500).render(
						'book',
						{ header, query, error: JSON.stringify(err) }
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

	async function showBookDetails(req, res) {
		const header = 'Book Details';
		const token  = getToken(req);
		const bookId = req.params.bookId;
		try {
			const bookRes = await services.getBook(token, bookId);
			const book = bookRes.book;
			res.render('book', { header, book });
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					res.status(400).render('book', { header, error: 'no bookId provided' });
					break;
				case 'UNAUTHENTICATED':
					res.status(401).render('book', { header, error: 'login required' });
					break;
				case 'NOT_FOUND':
					res.status(404).render('book', { header, error: `no book found with id ${bookId}` });
					break;
				default:
					console.log(err);
					res.status(500).render('book', { header, error: JSON.stringify(err) });
					break;
			}
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
	router.get('/books', listSavedBooks);
	
	// Show book
	router.get('/books/:bookId', showBookDetails);

	return router;
};
