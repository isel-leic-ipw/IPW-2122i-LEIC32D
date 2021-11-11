'use strict';

const express = require('express');

module.exports = function (services) {
	
	async function searchGlobalBooks(req, res) {
		try {
			const book = await services.searchBook(req.query.q);
			res.json(book);
		} catch (err) {
			res.status(500).json({ cause: err });
		}
	}
	
	const router = express.Router();
	
	router.get('/global/books', searchGlobalBooks);
	//router.post(...);
	//router.get(...);
	//router.delete(...);
	
	return router;
};
