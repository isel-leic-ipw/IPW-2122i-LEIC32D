'use strict';

const errors = require('./app-errors');

const fetch = require('node-fetch');

module.exports = function (
	es_host, es_port,
	idx_prefix,
	guest_user, guest_token
) {
	const baseUrl = `http://${es_host}:${es_port}`;

	const userBooksUrl = username =>
		`${baseUrl}/${idx_prefix}_${username}_books`;

	// TO DO: move to database
	const users = new Set([
		'jtrindade',
		'fpessoa',
		guest_user
	]);

	// TO DO: move to database
	const tokens = {
		'4chwViN4QHCTyTnUud88ww': 'jtrindade',
		'cEzwXhDATtaaI5ZAO9PfYA': 'fpessoa',
		[guest_token]: guest_user
	};

	function checkUser(username) {
		if (!users.has(username)) {
			throw errors.UNAUTHENTICATED(username);
		}
	}

	async function tokenToUsername(token) {
		return tokens[token];
	}

	async function hasBook(username, bookId) {
		checkUser(username);
		try {
			const response = await fetch(
				`${userBooksUrl(username)}/_doc/${bookId}`
			);
			return response.status === 200;
		} catch (err) {
			console.log(err);
			throw errors.FAIL(err);
		}
	}
	
	async function saveBook(username, bookObj) {
		checkUser(username);
		const bookId = bookObj.id;
		try {
			const response = await fetch(
				`${userBooksUrl(username)}/_doc/${bookId}?refresh=wait_for`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(bookObj)
				}
			);
			const answer = await response.json();
			return answer._id;
		} catch (err) {
			console.log(err);
			throw errors.FAIL(err);
		}
	}

	async function loadBook(username, bookId) {
		checkUser(username);
		try {
			const response = await fetch(
				`${userBooksUrl(username)}/_doc/${bookId}`
			);
			if (response.status === 200) {
				const answer = await response.json();
				return answer._source;
			}
		} catch (err) {
			console.log(err);
			throw errors.FAIL(err);
		}
		throw errors.NOT_FOUND({ id: bookId });
	}

	async function deleteBook(username, bookId) {
		checkUser(username);
		try {
			const response = await fetch(
				`${userBooksUrl(username)}/_doc/${bookId}?refresh=wait_for`,
					{
						method: 'DELETE'
					}
			);
			if (response.status === 200) {
				const answer = await response.json();
				return answer._id;
			}
		} catch (err) {
			console.log(err);
			throw errors.FAIL(err);
		}
		throw errors.NOT_FOUND({ id: bookId });
	}

	async function listBooks(username) {
		checkUser(username);
		try {
				const response = await fetch(
					`${userBooksUrl(username)}/_search`
				);
				if (response.status === 404) {
					return [];
				}
				const answer = await response.json();
				const hits = answer.hits.hits;
				const books = hits.map(hit => hit._source);
				return books;
		} catch (err) {
			console.log(err);
			throw errors.FAIL(err);
		}
	}

	async function deleteAllBooks() {
		Object.values(users).forEach(async user => {
			await fetch(
				`${userBooksUrl(username)}?refresh=wait_for`,
				{
					method: 'DELETE'
				}
			);
		});
	}

	return {
		tokenToUsername,
		hasBook,
		saveBook,
		loadBook,
		deleteBook,
		listBooks,
		deleteAllBooks
	};
};
