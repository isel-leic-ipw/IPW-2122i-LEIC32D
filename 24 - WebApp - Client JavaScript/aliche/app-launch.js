'use strict';

const default_port = 8888;
const port = process.argv[2] || default_port;

const config = require('./app-config');

const es_spec = {
	url: config.devl_es_url,
	prefix: 'prod'
};

const app = require('./app-server')(es_spec, config.guest);

app.listen(port);
