'use strict';

const express  = require('express');
const session  = require('express-session');
const passport = require('passport');

passport.serializeUser((userInfo, done) => { done(null, userInfo); });
passport.deserializeUser((userInfo, done) => { done(null, userInfo); });

module.exports = function (es_spec, guest) {

	const data_ext_books = require('./app-data-ext-books');
	const data_int =
		require('./app-data-int-elastic')(es_spec, guest);

	const services = require('./app-services')(data_ext_books, data_int);

	const webapi = require('./app-webapi')(services);
	const webui = require('./app-webui')(services, guest.token);

	const app = express();
	app.use(session({
		secret: 'isel-ipw',
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	app.set('view engine', 'hbs');

	app.use('/favicon.ico',
		express.static('static-files/favicon.ico'));
	app.use('/public', express.static('static-files'));

	app.use('/api', webapi);
	app.use('/', webui);

	return app;
};
