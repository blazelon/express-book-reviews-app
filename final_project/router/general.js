const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const publicUsers = express.Router();

publicUsers.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
publicUsers.get('/', function (req, res) {
    return res.status(200).json({ books });
});

// Get book details based on ISBN
publicUsers.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!isbn || isbn === '') {
        return res.status(400).json({ message: "Bad request. Missing ISBN in params." });
    }

    const doesBookExist = Object.keys(books).includes(isbn);

    if (!doesBookExist) {
        return res.status(404).json({ message: "Book with requested ISBN not found." });
    }
    return res.status(200).json(books[isbn]);
});

// Get book details based on author
publicUsers.get('/author/:author', function (req, res) {
    const author = req.params.author;

    if (!author || author === '') {
        return res.status(400).json({ message: "Bad request. Missing author in params." });
    }

    const booksbyauthor = {};
    for (let isbn in books) {
        if (books[isbn]['author'] === author) {
            booksbyauthor[isbn] = books[isbn];
        }
    }

    return res.status(200).json({ booksbyauthor });
});

// Get all books based on title
publicUsers.get('/title/:title', function (req, res) {
    const title = req.params.title;

    if (!title || title === '') {
        return res.status(400).json({ message: "Bad request. Missing title in params." });
    }

    const booksbytitle = {};
    for (let isbn in books) {
        if (books[isbn]['title'] === title) {
            booksbytitle[isbn] = books[isbn];
        }
    }

    return res.status(200).json({ booksbytitle });
});

//  Get book review
publicUsers.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!isbn || isbn === '') {
        return res.status(400).json({ message: "Bad request. Missing ISBN in params." });
    }

    const doesBookExist = Object.keys(books).includes(isbn);

    if (!doesBookExist) {
        return res.status(404).json({ message: "Book with requested ISBN not found." });
    }
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = publicUsers;
