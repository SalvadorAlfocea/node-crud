// Load environment variables
require('dotenv').config();

// Grab our dependencies
const express           = require('express'),
      app               = express(),
      port              = process.env.PORT || 8080,
	  expressLayouts    = require('express-ejs-layouts'),
      mongoose          = require('mongoose'),
      bodyParser		= require('body-parser'),
      session           = require('express-session'),
      cookieParser      = require('cookie-parser'),
      flash 			= require('connect-flash'),
      expressValidator  = require('express-validator'),
      path              = require('path'),
      formidable        = require('formidable'),
      fs                = require('fs');

/********** Application config **********/

// set sessions and cookie parser
app.use(cookieParser());
app.use(session({
	secret: process.env.SECRET, 
  	cookie: { maxAge: 60000 },
  	resave: false,   		 	// forces the session to be saved back to the store
  	saveUninitialized: false  	// dont save unmodified
}));
app.use(flash());

// Tell express where to look for static assets
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as our templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Connect to our database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, function(err, res) {

    let msg = 'Conexion a la base de datos establecida';
    if (err) msg = `Error al conectar a la base de datos:\n ${error}`;

    console.log(`[mongoose] => ${msg}`);
});

// Use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Set the routes ======================================
app.use(require('./app/routes'));

// Start our server ====================================
app.listen(port, function() {
    console.log(`App listening on http://localhost:${port}`);
});