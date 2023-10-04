//
//Standard Setup
//
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser'); // configuration of cookie-parser middleware
const morgan = require('morgan') // configure morgan

// configuration of express app - middleware
app.set('view engine', 'ejs');

// middleware
app.use(express.urlencoded({ extended: true })); //creates req.body // POST requests are sent as a Buffer (great for transmitting data but is not readable without this - this is middleware)
app.use(cookieParser()); //start up cookieParser
app.use(morgan('dev')); // start up morgan

// URL Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Randon string generator to simulate tinyUrl
const generateRandomString = (length) => Math.random().toString(36).substring(2, (length + 2))

// POST /urls
app.post('/urls', (req, res) => {
  let uniqueURL = generateRandomString(6); // call generate random string for unique url
  const longURL = req.body.longURL
  urlDatabase[uniqueURL] = longURL; // update urlDatabase with new unique url and long url 
  res.redirect(`/urls/${uniqueURL}`); // redirect after submittal to uniqueURL
});

// POST //urls/:id
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const updatedLongURL = req.body.updatedLongURL; // Edit longURL
  urlDatabase[id] = updatedLongURL;
  res.redirect('/urls');
})

// POST /urls/:id/delete
app.post('/urls/:id/delete', (req, res) => {
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete]; // Delete url entries from the database
  res.redirect('/urls');
});

// POST /login
app.post('/login', (req, res) => {
  const username = req.body.username
  res.cookie('username', username) //Save Cookies
  res.redirect('/urls')
})

// // POST /register
// app.post('/registration',(req, res) => {
// });

// // GET /register
// app.get('/registration',(req, res) => {

//   res.render('registration');
// });

// POST /logout
app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
});

// GET /urls
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
    urls: urlDatabase 
  };
  //passes the URL data to our template
  res.render("urls_index", templateVars);
});

// GET /urls/new
app.get('/urls/new', (req, res) => {
  templateVars = { 
    username: req.cookies['username']
  }
  res.render("urls_new.ejs", templateVars)
});

// GET /u/:id
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// GET /urls/:id
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id, longURL: urlDatabase[req.params.id],
    username: req.cookies['username'],
  }
  res.render('urls_show.ejs', templateVars)
});

// GET /urls/:id
app.get('/urls/:id', (req, res) => {
  const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id]}
  res.render('urls_show.ejs', templateVars)
});

// GET /
app.get('/', (req, res) => {
  res.send('Hello!');
});

// GET /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); //adds JSON string that reprents the entire urlDatabase objects at time of request
});

 // Listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});