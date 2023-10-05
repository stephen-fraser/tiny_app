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
  abc123: {
    longURL: "http://www.lighthouselabs.ca",
    userID: 'cba321'
  },
  def456: {
    longURL: "http://www.google.com",
    userID: 'fed654'
  }
};

const users = {
  cba321: {
    userID: "cba321",
    email: "a@a.com",
    password: "1234"
  },
  fed543: {
    userID: "fed543",
    email: "b@b.com",
    password: "5678"
  },
};

// function to filter urls based on userID
const getUrlsForUser = (urlDatabase, userID) => {

  let newDatabase = {}

    for (let URL in urlDatabase) {
      if (urlDatabase[URL].userID === userID) {
        newDatabase[URL] = urlDatabase[URL]
      }
   } 
   return newDatabase;
}

// Randon string generator to simulate tinyUrl
const generateRandomString = (length) => Math.random().toString(36).substring(2, (length + 2))

// function for getting user by email
const getUserByEmail = (users, email) => {

  let foundUser = null;

  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      foundUser = user;
    }
  }
  return foundUser;
};

// POST /urls
app.post('/urls', (req, res) => {

  if (!users[req.cookies['user.userID']]) {
    return res.status(401).send('Please login to make changes to the shortURL database.') 
  }

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

  const user = getUserByEmail(users, req.body.email)

  if (!user || user.password !== req.body.password) {
    return res.status(403).send('That email or password do not match our records.')
  }

  res.cookie('user.userID', user.userID) //Save Cookies
  res.redirect('/urls')
})

// POST /register
app.post('/registration',(req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  // did they NOT submit an email and password?
  if (!email || !password) {
    return res.status(400).send("Please provide an email and password to register.")
  }

  // use function to look for a user based on the email provided in the users objec
  if (getUserByEmail(users, email)) {
    return res.status(400).send('A user with that email is already in our database.');
  }

  let userID = generateRandomString(6) // use random string generatoed to create a unique ID

  const user = {
    userID: userID,
    email: email,
    password: password
  }

  users[userID] = user; //assigning the new user objects name as it's unique 4 character ID
  console.log(users)


  res.cookie('user.userID', user.userID) //
  res.redirect('/urls')
});

// GET /login
app.get('/login' ,(req, res) => {
  const templateVars = {
    user: users[req.cookies['user.userID']]
  };

  if (users[req.cookies['user.userID']]) {
    res.redirect('/urls');
  };

  res.render('login', templateVars);
});

// GET /register
app.get('/registration',(req, res) => {
  const templateVars = {
    user: users[req.cookies['user.userID']]
  };

  if (users[req.cookies['user.userID']]) {
    res.redirect('/urls')
  }

  res.render('registration', templateVars);
});

// POST /logout
app.post('/logout', (req, res) => {
  res.clearCookie('user.userID')
  res.redirect('/login')
});

// GET /urls
app.get('/urls', (req, res) => {

  const userID = req.cookies['user.userID']

  const templateVars = {
    user: users[userID],
    urls: getUrlsForUser(urlDatabase, userID)
  }

  //passes the URL data to our template
  res.render("urls_index", templateVars);
});

// GET /urls/new
app.get('/urls/new', (req, res) => {
  templateVars = { 
    user: users[req.cookies['user.userID']],
  }

  if (!users[req.cookies['user.userID']]) {
    res.redirect('/login') 
  }

  res.render("urls_new.ejs", templateVars)
});

// GET /u/:id
app.get("/u/:id", (req, res) => {

  const longURL = urlDatabase[req.params.id].longURL;

    if (!longURL) {
      return res.status(400).send("This short URL does not exist");
    }

  res.redirect(longURL);
});

// GET /urls/:id
app.get('/urls/:id', (req, res) => {

  // const userID = req.cookies['user.userID']

  // const templateVars = {
  //   user: users[userID],
  //   urls: getUrlsForUser(urlDatabase, userID)
  // }
  const userID = req.cookies['user.userID']
  const user = users[userID]

  if (!user) {
    return res.status(400).send('Please login to access this content.');
  }

  if (user.userID !== urlDatabase[req.params.id].userID) {
    return res.status(401).send('Access denied: this URL belongs to another user!'); 
  }

    const templateVars = {
      id: req.params.id, 
      longURL: urlDatabase[req.params.id].longURL,
      user: users[req.cookies['user.userID']],
    }
    res.render('urls_show.ejs', templateVars)
});

// GET /urls/:id
app.get('/urls/:id', (req, res) => {
   const templateVars = {
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies['user.userID']],
  }
  res.render('urls_show.ejs', templateVars)
});

// GET /
app.get('/', (req, res) => {

  if (!users[req.cookies['user.userID']]) {
    res.redirect('/login');
  }

  res.redirect('/urls')
});


 // Listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});