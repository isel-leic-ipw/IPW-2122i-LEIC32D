'use strict';

const data_ext = require('./app-data-ext-books');
const data_int = require('./app-data-int-mem');

const services = require('./app-services')(data_ext, data_int);

async function tryFindBook() {
		const book = await data_ext.findBook(process.argv[2]);
		console.log(":: SUCCESS ::");
		console.log(book);
}

async function tryGetBook() {
		const book = await data_ext.getBookById(process.argv[2]);	
		console.log(":: SUCCESS ::");
		console.log(book);
}

async function tryDataExtInt() {
	async function findAndSaveBook(query) {
		const book = await data_ext.findBook(query);
		return data_int.saveBook(book);
	}

	for (const query of process.argv.slice(2)) {
		await findAndSaveBook(query);
	}
	
	const books = await data_int.listBooks();
	
	console.log(':: BOOKS LIST ::');
	console.log(JSON.stringify(books, null, 2));
	console.log();
	
	for (const book of books) {
		const id  = await data_int.deleteBook(book.id);
		
		console.log(':: BOOK DELETED ::');
		console.log('ID:', id);
		console.log();
	}

	const books2 = await data_int.listBooks();
	
	console.log(':: FINAL BOOKS LIST ::');
	console.log(JSON.stringify(books2, null, 2));
	console.log();
}

async function tryServices() {
	async function findAndSaveBook(query) {
		const book = await services.searchBook(query);
		book.title = "X";
		return services.addBook(book.id);
	}

	for (const query of process.argv.slice(2)) {
		await findAndSaveBook(query);
	}
	
	const books = await services.getAllBooks();
	
	console.log(':: BOOKS LIST ::');
	console.log(JSON.stringify(books, null, 2));
	console.log();
	
	for (const book of books) {
		const id  = await services.delBook(book.id);
		
		console.log(':: BOOK DELETED ::');
		console.log('ID:', id);
		console.log();
	}

	const books2 = await services.getAllBooks();
	
	console.log(':: FINAL BOOKS LIST ::');
	console.log(JSON.stringify(books2, null, 2));
	console.log();
}

async function main() {
	try {
		//await tryFindBook();
		//await tryGetBook();
		//await tryDataExtInt();
		await tryServices();
	} catch (err) {
		console.log(":: FAILURE ::");
		console.log(err);
	}
}

main();
