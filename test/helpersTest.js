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

describe('#getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail(testUsers, "user@example.com")
    const expectedUserID = "userRandomID";
    console.log(user)
    assert.strictEqual(user, expectedUserID )
  });
});