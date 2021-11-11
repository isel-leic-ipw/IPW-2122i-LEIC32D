'use strict';

const data_ext = require('./app-data-ext-books');

async function main() {
	try {
		const book = await data_ext.findBook(process.argv[2]);
		//const book = await data_ext.getBookById(process.argv[2]);
		
		console.log(":: SUCCESS ::");
		console.log(book);
		
	} catch (err) {
		console.log(":: FAILURE ::");
		console.log(err);
	}
}

main();
