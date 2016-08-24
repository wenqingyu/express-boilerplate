'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

// const config = require('./config.js');
const app = express();

/* ---------- SITE CONFIG ----------- */
// PORT
app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));

// HEADER
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Json-Web-Token");
  res.header("Access-Control-Allow-Methods", "GET,OPTIONS");
  //set cache header
  res.setHeader("Cache-Control", "public, max-age=60"); // 1 min
  //set json response for all requests
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));

// CONFIG FILE
dotenv.load({ path: '.env' });

/* ---------- MONGODB CONFIG --------------- */
console.log(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/* ---------- CONTROLLERS CONFIG ----------- */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');


/* ---------- ROUTES CONFIG ---------------- */

/*  -- /api/v1 -- */
const api_prefix = '/api/v1';
app.get(api_prefix + '/user', userController.list); // adminScope
app.get(api_prefix + '/user/:account', userController.getUser); // userScope
app.put(api_prefix + '/user/:account', userController.createUser); // userScope
app.get(api_prefix + '/user/:account/device', userController.deviceList); // userScope
app.put(api_prefix + '/user/:account/device', userController.addDevice); // userScope
app.get(api_prefix + '/user/:account/ios', userController.getIOSInfo); // userScope
app.put(api_prefix + '/user/:account/ios', userController.IOSSwitch); // userScope

// app.get(api_prefix + '/user/:account', userController.get);
// app.post(api_prefix + '/user', userController.create);
// app.put(api_prefix + '/user', userController.update);
// app.delete(api_prefix + '/user/:account', userController.remove);
//




app.get('/*', homeController.greet);

/* ------------ ERROR HANDLE AND ENV CONFIG ---------- */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


/**
 * Error Handler.
 */
app.use(errorHandler());

/* ------------ ENGINE STARTER ---------- */

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
