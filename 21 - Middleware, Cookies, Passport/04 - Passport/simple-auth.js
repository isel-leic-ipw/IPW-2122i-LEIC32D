'use strict';

const express = require('express');
const session = require('express-session');
const passport = require('passport');

passport.serializeUser((userInfo, done) => { done(null, userInfo); });
passport.deserializeUser((userInfo, done) => { done(null, userInfo); });

const sessionHandler = session({
	secret: 'isel-ipw',
	resave: false,
	saveUninitialized: false,
});

const app = express();

app.use(express.urlencoded({extended:false})); // Read body into req.body
app.use(sessionHandler);        // Support sessions in req.session
app.use(passport.initialize()); // Support authentication with passport
app.use(passport.session());    // Support login sessions in passport

const users = {
	admin: { username: 'admin', password: 'admin' },
	isel:  { username: 'isel',  password: 'ipw'   },
	guest: { username: 'guest', password: '1234'  },
}

app.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.send(LoggedInHome(req));
	} else {
		res.send(NoLoginHome);
	}
});

app.post('/login', (req, res) => {
	const username = req.body.username; 
	const password = req.body.password;
	if (isValidUser(username, password)) {
		console.log('login:', username, '|', !!users[username]);
		req.login(users[username], (err) => {
			if (err) {
				console.log('>> login error :', err);
				// TO DO : additional error handling
			} else {
				console.log('>> login ok for', username);
			}
			res.redirect('/');
		});
	} else {
		res.status(401).send('Invalid user');
	}
	
	function isValidUser(username, password) {
		return users[username] && users[username].password === password;
	}
});

app.post('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.listen(8888);

const NoLoginHome = `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Passport Demo</title>
		</head>
		<body>
			<h3>Passport Demo</h3>
			<hr>
			<form action="/login" method="POST">
				Username: <input type="text" name="username">
				Password: <input type="password" name="password">
				<input type="submit" value="Login">
			</form>
			<hr>
			<br>
			<p>Hello IPW@ISEL</p>
		</body>
	</html>
`;

const LoggedInHome = req => `
	<html>
		<head>
			<meta charset='utf-8'>
			<title>Passport Demo</title>
		</head>
		<body>
			<strong>Passport Demo</strong>
			<hr>
			<form action="/logout" method="POST">
				User: <em>${req.user.username}</em>
				<input type="submit" value="Logout">
			</form>
			<hr>
			<br>
			<p>Hello ${req.user.username}</p>
		</body>
	</html>
`;
