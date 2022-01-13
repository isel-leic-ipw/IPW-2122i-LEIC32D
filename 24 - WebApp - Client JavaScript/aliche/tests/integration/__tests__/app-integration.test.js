'use strict';

const fetch   = require('node-fetch');
const request = require('supertest');

const config = require('../../../app-config');
const server = require('../../../app-server');

const es_spec = {
	url: config.devl_es_url,
	prefix: 'test'
};

test('Confirm database is running', async () => {
	const response = await fetch(`${es_spec.url}_cat/health`);
	expect(response.status).toBe(200);
});

describe('Integration tests', () => {

	const app = server(es_spec, config.guest);
	
	function deleteAllBooks() {
		return fetch(
			`${es_spec.url}${es_spec.prefix}_${config.guest.username}_books`,
			{ method: 'DELETE' }
		);
	}
	
	beforeAll(deleteAllBooks);
	afterEach(deleteAllBooks);
	
	test('Get empty bookshelf', async () => {
		const response = await request(app)
			.get('/api/my/books')
			.set('Authorization', `Bearer ${config.guest.token}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200); // or see below
		
		expect(response.status).toBe(200); // or see above
		expect(response.body).toBeTruthy();
		expect(response.body.books).toEqual([]);
	});
		
	test('Add book', async () => {
		const bookId = 'viRtzgEACAAJ';

		const addResponse = await request(app)
			.post('/api/my/books')
			.set('Authorization', `Bearer ${config.guest.token}`)
			.set('Accept', 'application/json')
			.send({ bookId })
			.expect('Content-Type', /json/)
			.expect(200);
		
		expect(addResponse.body).toBeTruthy();
		expect(addResponse.body.bookId).toEqual(bookId);

		const listResponse = await request(app)
			.get('/api/my/books')
			.set('Authorization', `Bearer ${config.guest.token}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);

		expect(listResponse.body).toBeTruthy();
		expect(listResponse.body.books).toHaveLength(1);
		expect(listResponse.body.books[0].id).toEqual(bookId);
	});
});
