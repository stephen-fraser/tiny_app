const { assert } = require('chai');

const {generateRandomString, getUrlsForUser, getUserByEmail} = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrlDatabse = {
  abc123: {
    longURL: "http://www.lighthouselabs.ca",
    userID: 'userRandomID'
  },
  def456: {
    longURL: "http://www.google.com",
    userID: 'user2RandomID'
  }
};


describe('#getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail(testUsers, "user@example.com")
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID )
  });
});


describe('#generateRandomString', () => {
  it('should generate a random string at a specified input length', () => {
    const sixCharacterString = generateRandomString(6);
    assert.strictEqual(sixCharacterString.length, 6 )
  });
  it('should generate random strings that do not match', () => {
    const string1 = generateRandomString(4);
    const string2 = generateRandomString(4);
    assert.notStrictEqual(string1, string2);
  });
});


describe('#getUrlsForUser', () => {
  it('should return all the url objects for a user', () => {
    const urls = getUrlsForUser(testUrlDatabse, "userRandomID")
    const expectedUrls = { 
      abc123: {
      longURL: "http://www.lighthouselabs.ca",
      userID: 'userRandomID'
    }}
    assert.deepEqual(urls, expectedUrls )
  });
});