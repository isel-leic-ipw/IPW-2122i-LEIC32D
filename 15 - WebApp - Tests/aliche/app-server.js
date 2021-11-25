'use strict';

const default_port = 8888;
const port = process.argv[2] || default_port;

const data_ext_books = require('./app-data-ext-books');
const data_int = require('./app-data-int-mem');

const services = require('./app-services')(data_ext_books, data_int);

const webapi = require('./app-webapi')(services);

const express = require('express');
const app = express();

app.use('/api', webapi);

app.listen(port);
