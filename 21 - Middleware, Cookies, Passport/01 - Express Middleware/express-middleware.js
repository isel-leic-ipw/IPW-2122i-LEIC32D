'use strict';

const express = require('express');
const app = express();

app.use(addDate);
app.use('/about', checkAuthorization);

app.get('/', getHome);
app.get('/about', getAbout);

app.listen(8888);

/* ==== ==== */

function addDate(req, res, next) {
	console.log();
	console.log('.. middleware: addDate ..');
	req.date = new Date();
	next();
}

function checkAuthorization(req, res, next) {
	const auth = req.get('Authorization');
	if (auth) {
		next();
	} else {
		res.status(401).send('Authentication required');
	}
}

function getHome(req, res) {
	console.log();
	console.log(':: HOME ::');
	res.send(`
		<html>
			<head><title>Express Middleware - Home</title></head>
			<body>
				<h2>Express Middleware</h2>
				<h3>Home</h3>
				<p><strong>Date:</strong> ${req.date}</p>
				<br><br>
				<hr>
				<a href='/about'>About</a>
			</body>
		</html>		
	`);
}

function getAbout(req, res) {
	console.log();
	console.log(':: ABOUT ::');
	res.send(`
		<html>
			<head><title>Express Middleware - About</title></head>
			<body>
				<h2>Express Middleware</h2>
				<h3>About</h3>
				<p><strong>Date:</strong> ${req.date}</p>
				<br><br>
				<hr>
				<a href='/'>Home</a>
			</body>
		</html>		
	`);
}
