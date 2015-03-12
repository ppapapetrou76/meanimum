var express = require('express'),
	app = express(),
	router = express.Router(),
	bodyParser = require('body-parser'),
	cfg = require('./app/config'),
	port = cfg.port,
	jwt = require('jsonwebtoken'),
	migrate = require('./app/scripts/migrate')(),
	mongoose = require('mongoose'),
	winston = require('winston');

/**
 * INITIALIZATION
 */
mongoose.connect(cfg.mongo.uri);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));

/**
 * API ROUTES
 */
app.use(cfg.path + '/auth', require('./app/routes/auth').auth);
app.use(cfg.path + '/products', require('./app/routes/product').products);

/**
 * ERROR HANDLER
 */
app.use(function (err, req, res, next) {

	if (!err) {
		return next();
	}

	winston.error(err.stack);
	res.status(err.status).json(err);

});

/**
 * START THIS DAMN THING
 */
app.listen(port);
console.log('Magic happens on port ' + port);
