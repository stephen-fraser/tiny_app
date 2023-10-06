//
//Standard Setup
//
const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require("bcryptjs");

//Helper functions from helpers.js
const {generateRandomString, getUrlsForUser, getUserByEmail} = require('./helpers');

// configuration of express app - middleware
app.set('view engine', 'ejs');

// middleware
app.use(express.urlencoded({ extended: true })); //creates req.body
app.use(morgan('dev'));
app.use(cookieSession({ // creates req.session
  name: 'tobias',
  keys: ['jfnryc'],
}));

// URL Database (for testing)
const urlDatabase = {
  abc123: {
    longURL: "http://www.lighthouselabs.ca",
    userID: 'cba321'
  },
  def456: {
    longURL: "http://www.google.com",
    userID: 'fed654'
  }
};

// Set hashed passwords (for testing)
let password1 = '1234';
const hash1 = bcrypt.hashSync(password1, 10);

let password2 = '5678';
const hash2 = bcrypt.hashSync(password2, 10);

// User database
const users = {
  cba321: {
    userID: "cba321",
    email: "a@a.com",
    password: hash1
  },
  fed654: {
    userID: "fed654",
    email: "b@b.com",
    password: hash2
  },
};

// POST /urls
app.post('/urls', (req, res) => {

  if (!users[req.session.userID]) {
    return res.status(401).send('Please login to make changes to the shortURL database.');
  }

  let uniqueURL = generateRandomString(6); // call generate random string for unique url
  const longURL = req.body.longURL;

  urlDatabase[uniqueURL] = {
    longURL: longURL,
    userID: req.session.userID
  };

  res.redirect(`/urls/${uniqueURL}`);
});

// POST //urls/:id
app.post('/urls/:id', (req, res) => {

  const userID = req.session.userID;
  const user = users[userID];

  const id = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;
  const destinationURL = urlDatabase[id];

  if (!destinationURL) {
    return res.status(400).send("This short URL does not exist");
  }

  if (!user) {
    return res.status(400).send('Please login to access this content.');
  }

  if (user.userID !== urlDatabase[req.params.id].userID) {
    return res.status(401).send('Access denied: this URL belongs to another user!');
  }

  urlDatabase[id].longURL = updatedLongURL;
  res.redirect('/urls');
});

// POST /urls/:id/delete
app.post('/urls/:id/delete', (req, res) => {

  const user = users[req.session.userID];
  const id = req.params.id;
  const destinationURL = urlDatabase[id];

  if (!destinationURL) {
    return res.status(404).send("This short URL does not exist");
  }

  if (!user) {
    return res.status(400).send('Please login to access this content.');
  }

  if (user.userID !== urlDatabase[id].userID) {
    return res.status(401).send('Access denied: this URL belongs to another user!');
  }

  const idToDelete = id;

  delete urlDatabase[idToDelete]; // Delete url entries from the database
  res.redirect('/urls');
});

// POST /login
app.post('/login', (req, res) => {

  const password = req.body.password;
  const email = req.body.email;

  if (!email || !password) {
    return res.status(400).send("Please provide an email and password.");
  }

  const user = getUserByEmail(users, req.body.email);

  if (!user) {
    return res.status(403).send("That email or password does not match our records.");
  }

  const result = bcrypt.compareSync(req.body.password, user.password);

  if (!result) {
    return res.status(403).send("That email or password does not match our records.");
  }

  // res.cookie("userId", user.userID);
  req.session.userID = user.userID;
  res.redirect('/urls');
});

// POST /register
app.post('/registration',(req, res) => {

  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  // did they NOT submit an email and password?
  if (!email || !password) {
    return res.status(400).send("Please provide an email and password to register.");
  }

  // use function to look for a user based on the email provided in the users objec
  if (getUserByEmail(users, email)) {
    return res.status(400).send('A user with that email is already in our database.');
  }

  let userID = generateRandomString(6); // use random string generatoed to create a unique ID

  const user = {
    userID: userID,
    email: email,
    password: password
  };

  users[userID] = user; //assigning the new user objects name as it's unique 4 character ID

  req.session.userID = userID; //
  res.redirect('/urls');
});

// GET /login
app.get('/login' ,(req, res) => {
  const templateVars = {
    user: users[req.session.userID]
  };

  if (users[req.session.userID]) {
    return res.redirect('/urls');
  }

  res.render('login', templateVars);
});

// GET /register
app.get('/registration',(req, res) => {
  const templateVars = {
    user: users[req.session.userID]
  };

  if (users[req.session.userID]) {
    return res.redirect('/urls');
  }

  res.render('registration', templateVars);
});

// POST /logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// GET /urls
app.get('/urls', (req, res) => {

  const userID = req.session.userID;

  const templateVars = {
    user: users[userID],
    urls: getUrlsForUser(urlDatabase, userID)
  };

  //passes the URL data to our template
  res.render("urls_index", templateVars);
});

// GET /urls/new
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };

  if (!users[req.session.userID]) {
    return res.redirect('/login');
  }

  res.render("urls_new.ejs", templateVars);
});

// GET /u/:id
app.get("/u/:id", (req, res) => {

  

  if (!urlDatabase[req.params.id]) {
    return res.status(400).send("This short URL does not exist");
  }

  const longURL = urlDatabase[req.params.id].longURL;

  res.redirect(longURL);
});

// GET /urls/:id
app.get('/urls/:id', (req, res) => {

  const userID = req.session.userID;
  const user = users[userID];

  if (!user) {
    return res.status(400).send('Please login to access this content.');
  }

  if(!urlDatabase[req.params.id]) {
    return res.status(404).send('Page not found.')
  }

  if (userID !== urlDatabase[req.params.id].userID) {
    return res.status(401).send('Access denied: this URL belongs to another user!');
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.userID],
  };
  res.render('urls_show.ejs', templateVars);
});

// GET /urls/:id
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.userID],
  };
  res.render('urls_show.ejs', templateVars);
});

// GET /
app.get('/', (req, res) => {

  if (!users[req.session.userID]) {
    return res.redirect('/login');
  }

  res.redirect('/urls');
});

// Listen
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});