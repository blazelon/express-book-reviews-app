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

// TODO: Remove
publicUsers.get('/users', function (req, res) {
    return res.status(200).json({ data: users });
});

// Get the book list available in the shop
publicUsers.get('/', function (req, res) {
    return res.status(200).json({ data: books });
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
    return res.status(200).json({ data: books[isbn] });
});

// Get book details based on author
publicUsers.get('/author/:author', function (req, res) {
    const author = req.params.author;

    if (!author || author === '') {
        return res.status(400).json({ message: "Bad request. Missing author in params." });
    }

    return res.status(200).json({ data: getBooksBy({ key: 'author', value: author }) });
});

// Get all books based on title
publicUsers.get('/title/:title', function (req, res) {
    const title = req.params.title;

    if (!title || title === '') {
        return res.status(400).json({ message: "Bad request. Missing title in params." });
    }

    return res.status(200).json({ data: getBooksBy({ key: 'title', value: title }) });
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
    return res.status(200).json({ data: books[isbn].reviews });
});

const getBooksBy = ({ key, value }) => {
    const filteredBooks = {};
    for (let isbn in books) {
        if (books[isbn][key] === value) {
            filteredBooks[isbn] = books[isbn];
        }
    }
    return filteredBooks;
}

module.exports.general = publicUsers;
