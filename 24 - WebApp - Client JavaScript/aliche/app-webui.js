'use strict';

const express = require('express');
const path = require('path');

module.exports = function (services, guest_token) {

	function getUsername(req) {
		return req.user && req.user.username;
	}

	function getToken(req) {
		return req.user && req.user.token;
	}
	
	function getHomepage(req, res) {
		res.render('home', { username: getUsername(req) });
	} 

	function getLoginPage(req, res) {
		res.render('login');
	} 

	async function doLogin(req, res) {
		const username = req.body.username;
		const password = req.body.password;
		try {
			const user = await services.checkAndGetUser(username, password);
			req.login({ username: user.username, token: user.token }, err => {
				if (err) {
					console.log('LOGIN ERROR', err);
				}
				res.redirect('/');
			});
		} catch (err) {
			// TO DO : improve error handling
			console.log('LOGIN EXCEPTION', err);
			res.redirect('/');
		}
	} 

	function doLogout(req, res) {
		req.logout();
		res.redirect('/');
	}

	function getSearchPage(req, res) {
		res.render('search', { username: getUsername(req) });
	} 

	async function findInLibrary(req, res) {
		const username = getUsername(req);
		const header = 'Find Book Result';
		const query = req.query.q;
		try {
			const bookRes = await services.searchBook(query);
			const book = bookRes.book;
			res.render(
				'book',
				{ username, header, query, book, allowSave: true }
			);
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					res.status(400).render(
						'book',
						{ username, header, error: 'no query provided' }
					);
					break;
				case 'NOT_FOUND':
					res.status(404).render(
						'book',
						{ username, header, query, error: 'no book found for this query' }
					);
					break;
				default:
					res.status(500).render(
						'book',
						{ username, header, query, error: JSON.stringify(err) }
					);
					break;
			}
		}
	}
	
	async function listSavedBooks(req, res) {
		const username = getUsername(req);
		try {
			const booksRes = await services.getAllBooks(getToken(req));
			const books = booksRes.books;
			res.render('list', { username, books });
		} catch (err) {
			res.status(500).render(
				'list', 
				{ username, error: JSON.stringify(err) }
			);
		}
	}

	async function showBookDetails(req, res) {
		const username = getUsername(req);
		const header = 'Book Details';
		const token  = getToken(req);
		const bookId = req.params.bookId;
		try {
			const bookRes = await services.getBook(token, bookId);
			const book = bookRes.book;
			res.render('book', { username, header, book });
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					res.status(400).render('book', { username, header, error: 'no bookId provided' });
					break;
				case 'UNAUTHENTICATED':
					res.status(401).render('book', { username, header, error: 'login required' });
					break;
				case 'NOT_FOUND':
					res.status(404).render('book', { username, header, error: `no book found with id ${bookId}` });
					break;
				default:
					console.log(err);
					res.status(500).render('book', { username, header, error: JSON.stringify(err) });
					break;
			}
		}
	}

	async function deleteBook(req, res) {
		const username = getUsername(req);
		const header = 'Delete Book';
		const token  = getToken(req);
		const bookId = req.params.bookId;
		try {
			await services.delBook(token, bookId);
			res.redirect('/books');
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					res.status(400).render('book', { username, header, error: 'no bookId provided' });
					break;
				case 'UNAUTHENTICATED':
					res.status(401).render('book', { username, header, error: 'login required' });
					break;
				case 'NOT_FOUND':
					res.status(404).render('book', { username, header, error: `no book found with id ${bookId}` });
					break;
				default:
					console.log(err);
					res.status(500).render('book', { username, header, error: JSON.stringify(err) });
					break;
			}
		}
	}

	async function saveBook(req, res) {
		const username = getUsername(req);
		const header = 'Save Book Result';
		const token  = getToken(req);
		const bookId = req.body.bookId;		
		try {
			await services.addBook(token, bookId);
			res.redirect('/books');
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					res.status(400).render('book', { username, header, error: 'no bookId provided' });
					break;
				case 'UNAUTHENTICATED':
					res.status(401).render('book', { username, header, error: 'login required' });
					break;
				case 'NOT_FOUND':
					res.status(404).render('book', { username, header, error: `no book found with id ${bookId}` });
					break;
				default:
					console.log(err);
					res.status(500).render('book', { username, header, error: JSON.stringify(err) });
					break;
			}
		}
	}

	const router = express.Router();
	
	router.use(express.urlencoded({ extended: true }));
	
	// Homepage
	router.get('/', getHomepage);
	
	// Login page
	router.get('/authenticate', getLoginPage);
	
	// Login action
	router.post('/login', doLogin);
	
	// Logout action
	router.post('/logout', doLogout);

	// Search page
	router.get('/search', getSearchPage);

	// Find in library
	router.get('/library', findInLibrary);
	
	// List saved books
	router.get('/books', listSavedBooks);
	
	// Save book
	router.post('/books', saveBook);
	
	// Show book
	router.get('/books/:bookId', showBookDetails);

	return router;
};
