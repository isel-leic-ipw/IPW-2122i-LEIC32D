'use strict';

const errors = require('../app-errors');

const services_builder = require('../app-services');

const test_data_int = require('../app-data-int-mem');
const mock_data_ext = require('app-data-ext');

const default_services =
	services_builder(mock_data_ext, test_data_int);

const test_user  = 'jtrindade';
const test_token = '4chwViN4QHCTyTnUud88ww';

describe('Search tests', () => {
	test('search book without a query', async () => {
		const services =
			services_builder(/* intentionally empty */);
			
		try {
			await services.searchBook(undefined);
		} catch (err) {
			expect(err.name).toEqual('MISSING_PARAM');
			return;
		}
		throw new Error("shouldn't return from searchBook with no query");
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
		throw new Error("shouldn't return from searchBook with inexisting book");
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
		
		afterEach(async () => {
			await test_data_int.reset();
		});
		
		test('save existing book', async () => {
			const bookId = 'E00FkgEACAAJ';
			const addRes = await
				default_services.addBook(test_token, bookId);
			expect(addRes).toBeDefined();
			expect(addRes.bookId).toEqual(bookId);
			const checkRes = await
				test_data_int.loadBook(test_user, bookId);
			expect(checkRes.id).toEqual(bookId);
		});
		
		test('obtain empty list', async () => {
			const listRes = await 
				default_services.getAllBooks(test_token);
			expect(listRes).toBeDefined();
			expect(listRes.books).toEqual([]);
		});
	}
);
