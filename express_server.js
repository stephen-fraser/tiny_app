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


app.post('/urls', (req, res) => {
  let uniqueURL = generateRandomString(); // call generate random string for unique url
  const longURL = req.body.longURL
  urlDatabase[uniqueURL] = longURL; // update urlDatabase with new unique url and long url 
  res.redirect(`/urls/${uniqueURL}`); // redirect after submittal to uniqueURL
});

// logs the POST request body to the console and responds 
app.post('/urls/:id', (req, res) => {
  const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id]}
  res.render('urls_show.ejs', templateVars)
});

//
// Delete url entries from the database
//
app.post('/urls/:id/delete', (req, res) => {
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete]; 
  res.redirect('/urls');
});


// new route handler for /urls
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  //passes the URL data to our template
  res.render("urls_index", templateVars);
});


//new route for /urls/new  - the form
app.get('/urls/new', (req, res) => {
  res.render("urls_new.ejs")
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

// displays HTML content that the /hello path responds with
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// set path created to display scope
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 // fetch path created to show error that you can't access value of a because of reference/scope error
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

 //
 // Listen
 //
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});