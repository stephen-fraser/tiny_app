//
//Standard Setup
//
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//
// configuration of express app - middleware
//
app.set('view engine', 'ejs');

//
// configuration of cookie-parser middleware
//
const cookieParser = require('cookie-parser');

//
//Database
//
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//
// Randon string generator to simulate tinyUrl
//
function generateRandomString() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let x = 0; x < 6; x++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

//
// POST requests are sent as a Buffer (great for transmitting data but is not readable without this - this is middleware)
//
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.post('/urls', (req, res) => {
  let uniqueURL = generateRandomString(); // call generate random string for unique url
  const longURL = req.body.longURL
  urlDatabase[uniqueURL] = longURL; // update urlDatabase with new unique url and long url 
  res.redirect(`/urls/${uniqueURL}`); // redirect after submittal to uniqueURL
});


//
// Edit longURL
//
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;
  urlDatabase[id] = updatedLongURL;
  res.redirect('/urls');
})

//
// Delete url entries from the database
//
app.post('/urls/:id/delete', (req, res) => {
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete]; 
  res.redirect('/urls');
});

//
//Save Cookies
//
app.post('/login', (req, res) => {
  const username = req.body.username
  res.cookie('username', username)
  res.redirect('/urls')
})

app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
});

// new route handler for /urls
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
    urls: urlDatabase 
  };
  //passes the URL data to our template
  res.render("urls_index", templateVars);
});

//new route for /urls/new  - the form
app.get('/urls/new', (req, res) => {
  templateVars = { 
    username: req.cookies['username']
  }
  res.render("urls_new.ejs", templateVars)
});

// redirect any request to ("u/:id") to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// logs the POST request body to the console and responds 
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id, longURL: urlDatabase[req.params.id],
    username: req.cookies['username'],
  }
  res.render('urls_show.ejs', templateVars)
});

//new route for URL tinyIDs
app.get('/urls/:id', (req, res) => {
  const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id]}
  res.render('urls_show.ejs', templateVars)
});

app.get('/', (req, res) => {
  res.send('Hello!');
});

// adds JSON string that reprents the entire urlDatabase objects at time of request
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


 //
 // Listen
 //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});