
'use strict';

const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const Router = require("./routes/index");
const errorHandler = require("./handler/ErrorHandler");

app.use(morgan('dev'));
app.use(helmet());
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const corsOption = {
    method: ['POST', 'GET', 'DELET', 'PATCH'],
    origin: '*',
    optionsSuccessStatus: 204
};

app.use(cors(corsOption));
app.use('/', Router);

app.use(errorHandler.notFound);


app.use(errorHandler.productionErrors);


module.exports = app;