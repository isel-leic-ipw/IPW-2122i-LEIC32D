'use strict';

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
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
	const cart = req.cookies.cart;
	if (cart) {
		req.cart = JSON.parse(cart);
	} else {
		req.cart = {};
	}
	next();
}

function addToCart(req, res) {
	const prod = req.body.prod;
	const qntt = Number(req.body.qntt || 1);
	
	const cart = req.cart; // get current cart from request
	
	cart[prod] = (cart[prod] || 0) + qntt;
	
	res.cookie('cart', JSON.stringify(cart), { maxAge: 60*60*1000 });
	res.redirect('/');
}

function getCart(req, res) {
	res.json(req.cart);
}
