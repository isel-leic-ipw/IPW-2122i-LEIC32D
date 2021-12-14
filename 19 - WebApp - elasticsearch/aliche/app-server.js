'use strict';

const default_port = 8888;
const port = process.argv[2] || default_port;

const es_host = 'localhost';
const es_port = 9200;

const es_prefix = 'prod';

const guest_user  = 'guest';
const guest_token = 'fz3zMebxQXybYskc567j5w';

const data_ext_books = require('./app-data-ext-books');
const data_int =
	require('./app-data-int-elastic')(
		es_host, es_port,
		es_prefix,
		guest_user, guest_token
	);

const services = require('./app-services')(data_ext_books, data_int);

const webapi = require('./app-webapi')(services);
const webui = require('./app-webui')(services, guest_token);

const express = require('express');
const app = express();

app.set('view engine', 'hbs');

app.use('/favicon.ico',
	express.static('static-files/favicon.ico'));
app.use('/public', express.static('static-files'));

app.use('/api', webapi);
app.use('/', webui);

app.listen(port);
