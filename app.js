var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var index = require('./routes/index');
var apis = require('./routes/apis');
var qacore = require('./routes/qacore');

var app = express();

// view engine setup
var blocks = {};
var oneDay = 86400000;
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneDay}));

// Magic global
global.options = {
    root: path.join(__dirname, 'views'),
    dotfiles: 'deny',
    headers: {
        // 'x-timestamp': Date.now(),
        'x-sent': true
    },
    maxAge: 86400000
};

// No, I am not developing
/**
 var logger = require('morgan');
 var bodyParser = require('body-parser');
 var hbs = require('hbs');

 app.set('env', 'development');
 app.set('views', path.join(__dirname, 'views'));
 app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: false}));
 */

// Sequence is important
app.use('/api', apis);
app.use('/qa', qacore);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
/**
 if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 */

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.sendFile('error.html', global.options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Someone does __bad__!');
        }
    });
});


module.exports = app;
