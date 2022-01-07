'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');

const FileStore = require('session-file-store')(session);

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(session({
	cookie: { maxAge: 60*60*1000 },
	secret: 'isel-ipw',
	resave: false,
	saveUninitialized: false,
	store: new FileStore()
}));
app.use(loadCart);

app.get('/', getHome);
app.post('/cart', addToCart);
app.get('/cart', getCart);

app.listen(8888);

/* ==== ==== */

const fileOptions = {
	root: path.join(__dirname)
};

function getHome(req, res) {
	res.sendFile('home.html', fileOptions);
}

function loadCart(req, res, next) {
	const cart = req.session.cart;
	if (cart) {
		req.cart = cart;
	} else {
		req.cart = {};
	}
	next();
}

function addToCart(req, res) {
	const prod = req.body.prod;
	const qntt = Number(req.body.qntt || 1);
	
	const cart = req.cart; // get current cart from request
	
	cart[prod] = (cart[prod] || 0) + qntt; // add product to cart
	
	req.session.save(() => {  // session-file-store BUG workaround
		res.redirect('/');
	});
}

function getCart(req, res) {
	res.json(req.cart);
}
