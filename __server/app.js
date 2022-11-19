const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const partiesRouter = require('./routes/partie');

const app = express();
const version = String(new Date().getTime())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Expose-Headers', 'Server-version');
  res.setHeader('Server-version', version);
  next();
});

app.use('/', indexRouter);
app.use('/parties', partiesRouter);

const generateur = require('./Generateur');
generateur.demarrer();

module.exports = {
  app: app,
  gen: generateur,
  version: version
};
