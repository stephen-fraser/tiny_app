

# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Home Page of TinyApp displaying a user's list of TinyURLs"](https://github.com/stephen-fraser/tiny_app/blob/main/docs/urls-page.png?raw=true)
!["TinyURL page where you can edit the long URL or click on the link to visit the website"](https://github.com/stephen-fraser/tiny_app/blob/main/docs/tinyUrl-page.png?raw=true)

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
- Since tiny urls are meant for to simulate sharing a of your shortened urls to others, anyone can travel to them through http://localhost:8080/u/:id

I hope you enjoy my very first project.

Steve
