/*In this file we:
1. Import dependencies by require() and initialize the application
2. Setup and link the view files
3. Map the URLs to the target files
4. Setup the server
*/


const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);


//DB config
const db = require('./config/keys').MongoUri;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser middleware
app.use(express.urlencoded({ extended:false }));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes - specifying router files
app.use('/', require('./routes/index') );
app.use('/users', require('./routes/users'));


//Setup Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))