const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// configuration of express app
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// new route handler for /urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  //passes the URL data to our template
  res.render("urls_index", templateVars);
});

//new route 
app.get('/urls/:id', (req, res) => {
  const templateVars = {id: req.params.id, longURL:'http://www.lighthouselabs.ca/'}
  res.render("urls_show.ejs", templateVars)
});

app.get("/", (req, res) => {
  res.send("Hello!");
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
 
 // fetch path created to show erro that you can't access value of a because of reference/scope error
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});