
'use strict';

var http = require('http');
var express = require('express');
var path = require('path');
var vhost = require('vhost')
  	require('express-resource');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('nconf');
var router = express.Router();


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
    app.set('port', config.get('port'));
    
// Подключение нескольких тестовых статичных сайтов или поддоменов.
var apps = {
	docs: express()
};
	for (var key in apps) {
		apps[key].use(express.static(__dirname + '/subdomain/' + key));
		app.use(`/subdomain/${key}`, apps[key]); // для тестирования субдомена на сервере разработки
	}

  // - - - - - - - - - - - - - - - - - - - - -
	// запуск http-сервера // 
	// - - - - - - - - - - - - - - - - - - - - -
http.createServer(app). listen(process.env.PORT, process.env.IP, function(){
  console.log('Express server listening on port ' + config.get('port'));
});

//скрытие публичных данных о шаблонизаторе
app.disable('x-powered-by');
	
	// - - - - - - - - - - - - - - - - - - - - -
	// блок базовых настроек // 
	// - - - - - - - - - - - - - - - - - - - - -
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



//блок подключения статики v. 0.0.1

app.use(function(err, req, res, next){
  if (req.url == '/forbidden') {
  next (new Error("403"));
} else {
  next();
}
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//этот кусок кода отвечает за вывод статуса 404
app.use(function(req, res) {
  res.status(404).render('404');
});

if (process.env.NODE_ENV === 'development') {
  // only use in development 
  app.use(errorhandler());
}

module.exports = app;

/*
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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


module.exports = app;
*/
