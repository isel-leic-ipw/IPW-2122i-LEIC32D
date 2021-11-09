'use strict';

const express = require('express');

const app = express();

app.get('/', (request, response) => {
	console.log('Method:', request.method);
	console.log('Path:',request.path);
	console.log('Query:',request.query);

	response.write(`Method: ${request.method}\n`);
	response.write(`Path: ${request.path}\n`);
	response.write(`Query: ${JSON.stringify(request.query)}\n`);
	response.send();
});

app.get('/show', (request, response) => {
	console.log('Method:', request.method);
	console.log('Path:',request.path);
	console.log('Query:',request.query);

	response.write(`Method: ${request.method}\n`);
	response.write(`Path: ${request.path}\n`);
	response.write(`Query: ${JSON.stringify(request.query)}\n`);
	response.send();
});

app.get('/users/:username/info/:infoitem', (request, response) => {
	console.log('Method:', request.method);
	console.log('Path:',request.path);
	console.log('Query:',request.query);
	console.log('Params:',request.params);
	
	response.write(`Method: ${request.method}\n`);
	response.write(`Path: ${request.path}\n`);
	response.write(`Query: ${JSON.stringify(request.query)}\n`);
	response.write(`Params: ${JSON.stringify(request.params)}\n`);
	response.send();
});



app.listen(8888);
