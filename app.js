const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');




const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');


const app = express();
server = app.listen(3000)
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log('new user connected')
    
    socket.username = "Anonymous"
    
    socket.on("change username", (data) => {
        socket.username = data.username
    })
    socket.on('new messge', (data) => {
        io.socket.emit('new_message', {message : data.message, username : socket.username});
        
    })
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    })
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);

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
