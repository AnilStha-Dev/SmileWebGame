//#  required dependencies
const session = require('express-session'); //import express-session dependency
const bodyParser = require('body-parser'); //import body-parser dependency 
const express = require('express'); //import express dependency 
const app = express(); //declare app variable as express
let conn = require('./mysql.js'); //import mysql connection file

//# settings

app.set('view engine', 'ejs'); //set web templating engine as ejs
app.use(express.static('public')); //set public as the css/js express static folder
app.use(
  bodyParser.urlencoded({  //initialize bodyParser 
    extended: false
  })
);
app.use(bodyParser.json()); //initialize bodyParser's json
app.use(
  session({             //initialize session which is to be used with specified settings
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//# render, and authorization
app.get('/', (req, res) => {    //get function to render login.ejs
  res.render('login.ejs');
});

app.get('/home', (req, res) => {  //get function to render home.ejs
  res.render('homepage.ejs');
});

app.get('/register', (req, res) => {  //get function to render register.ejs
  res.render('register.ejs');
});

app.post('/auth_login', (req, res) => { //post function to authorize user login
  let email = req.body.email,           //declare email/password variable
    password = req.body.password;

  if (email && password) {
    conn.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',  //set conn query to mysql
      [email, password],    //insert email and password as data
      (err, results) => {   //function for error throwing and the results
        if (err) throw err;
        if (results.length > 0) {
          req.session.loggedin = true;   //set loggedin property as true
          req.session.loggedout = false;  //set loggedout property as false
          req.session.email = email;    //set email property as email itself
          res.redirect('/home');    //redirect to home
        } else {
          res.json({    //json output with error and error code
            code: 400,
            err: 'Incorrect credentials'
          });
        }
        res.end();
      }
    );
  }
});

app.post('/auth_register', (req, res) => {  //post function to authorize registration
  let register_data = {   //set register_data variable to have name, email, and password property
    firstname: req.body.firstname,
    lastname:req.body.lastname,
    email: req.body.email,
    password: req.body.password
  };
  conn.query('INSERT INTO users SET ?', register_data, (err, results) => {  //set conn query to mysql with err and the results
    if (err) throw err;
    else {
      console.log('Data inserted!', results);  //output to console
      res.redirect('/');  //redirect to login page
    }
  });
});

app.get('*', (req, res) => {
  res.send('404 - Page not found'); //set other unknown pages as 404
});

//# middleware port
app.listen(3000, () => { //listen to port
  console.log('Port established in 3000'); //output to console
});
