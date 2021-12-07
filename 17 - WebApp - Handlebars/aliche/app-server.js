'use strict';

const default_port = 8888;
const port = process.argv[2] || default_port;

const guest_user  = 'guest';
const guest_token = 'fz3zMebxQXybYskc567j5w';

const data_ext_books = require('./app-data-ext-books');
const data_int =
	require('./app-data-int-mem')(guest_user, guest_token);

const services = require('./app-services')(data_ext_books, data_int);

const webapi = require('./app-webapi')(services);
const webui = require('./app-webui')(services, guest_token);

const express = require('express');
const app = express();

app.use('/api', webapi);
app.use('/', webui);

app.listen(port);
