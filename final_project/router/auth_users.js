const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let user = users.filter((user) => user.username === username)
  if (user>0){
    return true
  }else{
    return false
  }
};

const authenticatedUser = (username, password) => {
  let user = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (users.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        { username: username, password: password },
        "accessToken",
        { expiresIn: 60*60 }
      );
      req.session.authorization = {
        username,
        password,
        accessToken,
      };
      res
        .status(200)
        .json({
          message: "User successfully logged in",
          accessToken: accessToken,
        });
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } else {
    res.status(400).json({ message: "Unable to login user." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  let book = Object.values(books).filter((book) => book.isbn === isbn)[0];

if (book ) {
    book.reviews = review;
    res.status(200).json({ message: "Review added successfully" });
} else {
    res.status(404).json({ message: "Book not found" });
}
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  
  let book = Object.values(books).filter((book) => book.isbn === isbn)[0];
  if (book) {
    delete book
    res.status(200).json({ message: "Book deleted successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
