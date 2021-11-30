'use strict';

const express = require('express');
const path = require('path');

module.exports = function (services) {
	
	const fileOptions = {
		root: path.join(__dirname, 'views'),
		dotfiles: 'deny'
	};

	function getToken(req) {
		return 'fz3zMebxQXybYskc567j5w'; // to be improved...
	}
	
	function getHomepage(req, res) {
		res.sendFile('home.html', fileOptions);
	} 
	
	function getSearchPage(req, res) {
		res.sendFile('search.html', fileOptions);
	} 
	
	async function findInLibrary(req, res) {
		const query = req.query.q;
		try {
			const bookRes = await services.searchBook(query);
			sendFindResponse(200, produceBook, bookRes.book);
		} catch (err) {
			switch (err.name) {
				case 'MISSING_PARAM':
					sendFindResponse(400, produceNoQuery);
					break;
				case 'NOT_FOUND':
					sendFindResponse(404, produceNotFound);
					break;
				default:
					sendFindResponse(500, produceError, JSON.stringify(err));
					break;
			}
		} 

		function sendFindResponse(statusCode, produceMain, data) {
			res.status(statusCode).send(`
					<!DOCTYPE html>
					<html>
						<head>
							<meta charset='utf-8'>
							<title>ALiChe - Find Book Result</title>
						</head>
						<body>
							<nav>
								<a href="/">Home</a> |
								<a href="/search">Search</a> |
								<a href="/list">List</a>
							</nav>
							<hr>
							<h1>Find Book Result</h1>
							
							${ produceMain(data) }
						</body>
					</html>			
			`);
		}

		function produceBook(book) {
			return `
					<p>Query: ${query}</p>
					<table>
						<tr>
							<td>Title:</td>
							<td>${book.title}</td>
						</tr>
						<tr>
							<td>Author(s):</td>
							<td>${book.authors ? book.authors.join('<br>') : '--'}</td>
						</tr>
					</table>
				`;
		}
	
		function produceNoQuery() {
			return `
					<strong>ERROR:</strong> no query provided
				`;
		}
		
		function produceNotFound() {
			return `
					<p>Query: ${query}</p>
					<p>ERROR: no book found for this query</p>
				`;
		}
		
		function produceError(errText) {
			console.log('ERROR', err);
			return `
					<p>Query: ${query}</p>
					<p>ERROR: ${errText}</p>
				`;
		}
	} 

	async function listSavedBooks(req, res) {
		try {
			const booksRes = await services.getAllBooks(getToken(req));
			sendListResponse(200, produceBookList, booksRes.books);
		} catch (err) {
			sendListResponse(500, produceError, JSON.stringify(err));
		}
		
		function sendListResponse(statusCode, produceMain, data) {
			res.status(statusCode).send(`
				<!DOCTYPE html>
				<html>
					<head>
						<meta charset='utf-8'>
						<title>ALiChe - Bookshelf</title>
					</head>
					<body>
						<nav>
							<a href="/">Home</a> | 
							<a href="/search">Search</a> |
							<a href="/list">List</a>
						</nav>
						<hr>
						<h1>Bookshelf</h1>

						${ produceMain(data) }
					</body>
				</html>
			`);
		}
		
		function produceBookList(books) {
			return books.length == 0 ? 
					'<p><em>(empty)</em></p>' : `
					<table>
						<tr>
							<th>Author(s)</th>
							<th>Title</th>
						</tr>
						${books.map(produceBook).join('')}
					</table>
				`;
		}
		
		function produceBook(book) {
			return `
					<tr>
						<td>${book.authors ? book.authors.join('<br>') : '--'}</td>
						<td>${book.title}</td>
					</tr>
				`;
		}
		
		function produceError(errTxt) {
			console.log('ERROR', errTxt);
			return `
					<p>ERROR: ${errTxt}</p>
				`;
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
