

# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- If the server is running successfully, the message 'TinyApp listening on port 8080!' will appear in your terminal
- Visit http://localhost:8080/ in your browser
- You should be directed to the login page where you can proceed to login or select register to register as a new user
- From there you can create new tiny urls 
- A user is in control of their tiny urls and are the only ones that can edit/delete them
- Since tiny urls are meant for sharing, anyone can travel to through http://localhost:8080/u/${tinyURL} 

