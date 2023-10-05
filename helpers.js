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
module.exports = {generateRandomString, getUrlsForUser, getUserByEmail}


