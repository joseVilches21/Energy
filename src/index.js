const express = require('express');
const morgan = require('morgan');
const path = require('path');
const {engine} = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys')


// initializations
const app = express();
require('./lib/passport');

// settings
app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine ({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  }))
app.set('view engine', 'hbs');

// middlewares
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// global variables
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

// routes
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication.js'));
app.use('/tours',require('./routes/tours.js'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// starting the servers
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})