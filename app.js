var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var arr=require('./config/ingoreRouter');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var phoneRouter = require('./routes/phone');
var brandRouter = require('./routes/brand');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req,res,next){ 
console.log(req.cookies);
if(arr.indexOf(req.url)>-1){
  // 判断字符串是否在数组中，大于-1，说明就存在；(或者！=-1)
 
  next();
  return;
}
var nickname=req.cookies.nickname;
if(nickname){ 
  next()
}else{
   res.redirect('/login.html');
}
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/phone',phoneRouter);
app.use('/brand',brandRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
