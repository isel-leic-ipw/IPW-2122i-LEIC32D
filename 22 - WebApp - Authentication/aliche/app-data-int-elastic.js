'use strict';

const errors = require('./app-errors');

const fetch = require('node-fetch');

module.exports = function (es_spec, guest) {
	const user_list = require('./app-data-int-users')(guest);
	const users  = user_list.users;
	const tokens = user_list.tokens;

	const baseUrl = `${es_spec.url}`;

	const userBooksUrl = username =>
		`${baseUrl}${es_spec.prefix}_${username}_books`;

	function checkUser(username) {
		if (!users[username]) {
			throw errors.UNAUTHENTICATED(username);
		}
	}

	async function getUser(username) {
		checkUser(username);
		return users[username];
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
		Object.values(users).forEach(async username => {
			await fetch(
				`${userBooksUrl(username)}?refresh=wait_for`,
				{
					method: 'DELETE'
				}
			);
		});
	}

	return {
		getUser,
		tokenToUsername,
		hasBook,
		saveBook,
		loadBook,
		deleteBook,
		listBooks,
		deleteAllBooks
	};
};
