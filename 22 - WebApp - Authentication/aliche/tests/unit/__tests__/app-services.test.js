'use strict';

const config = require('../../../app-config');
const errors = require('../../../app-errors');

const test_user = config.guest;

const services_builder = require('../../../app-services');

const mock_data_ext = require('app-data-ext-books');
const test_data_int =
	require('../../../app-data-int-mem')(test_user);

const default_services = services_builder(
	mock_data_ext,
	test_data_int
);

describe('Search tests', () => {
	test('search book without a query', async () => {
		const services = services_builder(
			/* intentionally left blank */
		); 
		
		try {
			await services.searchBook(undefined);
		} catch (err) {
			expect(err.name).toEqual('MISSING_PARAM');
			return;
		}
		throw new Error(
			"shouldn't return from searchBook when query is empty"
		);
	});

	test('search for inexisting book', async () => {
		const services =
			services_builder({
				findBook: async () => {
					throw errors.NOT_FOUND('no book');
				}
		}); 
		
		try {
			await services.searchBook('inexisting book');
		} catch (err) {
			expect(err.name).toEqual('NOT_FOUND');
			return;
		}
		throw new Error(
			"shouldn't return from searchBook when book doesn't exist"
		);
	});

	test('search for existing book', async () => {
		const res = await 
			default_services.searchBook('livro+do+desassossego');
		expect(res).toBeDefined();
		expect(res.book).toEqual(
			mock_data_ext.books['E00FkgEACAAJ']
		);
	});
});

describe('Tests with DB', () => {

	//beforeAll(...);
	//afterAll(...);

	//beforeEach(...);
	afterEach(async () => {
		await test_data_int.deleteAllBooks();
	});

	test('save existing book', async () => {
		const bookId = 'E00FkgEACAAJ';
		const addRes = await
			default_services.addBook(test_user.token, bookId);
		expect(addRes).toBeDefined();
		expect(addRes.bookId).toEqual(bookId);
		const checkRes = await
			test_data_int.loadBook(test_user.username, bookId);
		expect(checkRes.id).toEqual(bookId);
	});

	test('obtain empty book list', async () => {
		const listRes = await
			default_services.getAllBooks(test_user.token);
		expect(listRes).toBeDefined();
		expect(listRes.books).toEqual([]);
	});

});
