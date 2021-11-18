'use strict';

const express = require('express');

module.exports = function (services) {
	
	function onError(req, res, err) {
		switch (err.name) {
			case 'NOT_FOUND': 
				res.status(404);
				break;
			case 'EXT_SVC_FAIL':
				res.status(502);
				break;
			case 'MISSING_PARAM': 
			case 'INVALID_PARAM': 
				res.status(400);
				break;
			default:
				res.status(500);				
		}
		res.json({ cause: err });
	}
	
	async function searchGlobalBooks(req, res) {
		try {
			const book = await services.searchBook(req.query.q);
			res.json(book);
		} catch (err) {
			onError(req, res, err);
		}
	}

	async function getMyBooks(req, res) {
		try {
			const books = await services.getAllBooks();
			res.json(books);
		} catch (err) {
			onError(req, res, err);
		}
	}

	async function getMyBookById(req, res) {
		try {
			const bookId = req.params.bookId;
			const book = await services.getBook(bookId);
			res.json(book);
		} catch (err) {
			onError(req, res, err);
		}
	}	

	async function addMyBookById(req, res) {
		try {
			const bookId = req.body.bookId;
			const addBookRes = await services.addBook(bookId);
			res.json(addBookRes);
		} catch (err) {
			onError(req, res, err);
		}
	}	

	async function deleteMyBookById(req, res) {
		try {
			const bookId = req.params.bookId;
			const bookIdRes = await services.delBook(bookId);
			res.json(bookIdRes);
		} catch (err) {
			onError(req, res, err);
		}
	}	

	const router = express.Router();

	router.use(express.json());

	// Resource: /global/books
	router.get('/global/books', searchGlobalBooks);

	// Resource: /my/books
	router.get('/my/books', getMyBooks);
	router.post('/my/books', addMyBookById);

	// Resource: /my/books/<bookId>
	router.get('/my/books/:bookId', getMyBookById);
	router.delete('/my/books/:bookId', deleteMyBookById);

	return router;
};
