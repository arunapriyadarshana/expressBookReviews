const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    let user = users.filter((user) => user.username === username);
    if (user.length > 0) {
      res.status(400).send("User already exists");
    } else {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  axios.get("https://api.example.com/books")
    .then(function (response) {
      res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
      res.status(500).send("Error retrieving book list");
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    let isbn = req.params.isbn;
    let response = await axios.get(`https://api.example.com/books/${isbn}`);
    let book = response.data;
    if (book) {
      res.send(JSON.stringify(book));
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving book details");
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    let author = req.params.author;
    let response = await axios.get(`https://api.example.com/books?author=${author}`);
    let books = response.data;
    if (books.length > 0) {
      res.send(JSON.stringify(books));
    } else {
      res.send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving book details");
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    let title = req.params.title;
    let response = await axios.get(`https://api.example.com/books?title=${title}`);
    let books = response.data;
    if (books.length > 0) {
      res.send(JSON.stringify(books));
    } else {
      res.send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving book details");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let filtered_books = Object.values(books).filter(
    (book) => book.isbn === isbn
  );
  if (filtered_books.length > 0) {
    res.send(JSON.stringify(filtered_books[0].reviews));
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
