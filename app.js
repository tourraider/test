var express = require('express');
var path = require('path');
var logger = require('./common/logger');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var compress = require('compression');
var bodyParser = require('body-parser');

var config = require('./config');
var auth = require('./middlewares/auth')
var errorhandler = require('errorhandler');

var Router = require('./router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
  secret: config.session_secret,
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host,
    db: config.redis_db,
    pass: config.redis_password,
  }),
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(auth.checkUserLogin)

app.use('/', Router);

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('port', config.port);

if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    logger.error(err);
    return res.status(500).send('500 status');
  });
}

var hostName = config.debug ? config.dev_host : config.hostname;

if (!module.parent) {
  app.listen(config.port, function () {
    logger.info('tourRaider listening on port', config.port);
    logger.info('God bless love....');
    logger.info('You can debug your app with http://' + hostName + ':' + config.port);
    logger.info('');
  });
}

module.exports = app;
