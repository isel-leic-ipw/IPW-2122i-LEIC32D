'use strict';

module.exports = function (es_spec, guest) {

	const data_ext_books = require('./app-data-ext-books');
	const data_int =
		require('./app-data-int-elastic')(es_spec, guest);

	const services = require('./app-services')(data_ext_books, data_int);

	const webapi = require('./app-webapi')(services);
	const webui = require('./app-webui')(services, guest.token);

	const express = require('express');
	const app = express();

	app.set('view engine', 'hbs');

	app.use('/favicon.ico',
		express.static('static-files/favicon.ico'));
	app.use('/public', express.static('static-files'));

	app.use('/api', webapi);
	app.use('/', webui);

	return app;
};
