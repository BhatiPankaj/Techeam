var createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    app = express(),
    bodyParser  =  require("body-parser"),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require("passport"),
    config = require("./config/database");

// let  user = require('./models/user');
mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

db.once("open", function(){
    console.log("connected to mongodb");
})

db.on("error", function(err){
    console.log(err);
})

app.use(expressValidator());
app.use(express.json());
app.use(cookieParser("secret"));
 app.use(session({
     secret: 'secret',
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index'),
    users = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', users);

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

app.listen(1111,function(){
  console.log("server started on port 1111");
});
