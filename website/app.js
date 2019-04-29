var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();

var homeRouter = require('./routes/home');
var blockRouter = require('./routes/block');
var transactionRouter = require('./routes/transaction');
var ethTableRequests = require('./routes/ethTableRequests');

var mongoRequests = require('./routes/mongoRequests');
var externalApiRequests = require('./routes/externalApiRequests');

var app = express();

app.set('views', path.join(__dirname, '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(express.static(__dirname + '/public'));
app.use("/public", express.static(__dirname + "/public"));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Page Endpoints
app.use('/', homeRouter);
app.use('/block', blockRouter);
app.use('/transaction', transactionRouter);

//API Endpoints Below
app.use('/eth', ethTableRequests);
app.use('/mongo', mongoRequests);
app.use('/externalApis', externalApiRequests);



module.exports = app;
