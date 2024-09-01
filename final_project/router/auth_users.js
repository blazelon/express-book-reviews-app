const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regdUsers = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regdUsers.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regdUsers.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (!book) {
        res.send("Unable to find the book!");
        return;
    }

    let review = req.body.review;
    if (review) {
        book["reviews"][req.user] = review;
    }
    books[isbn] = book;
    res.send(`Book review with the ISBN ${isbn} updated.`);
});

// Delete a book review
regdUsers.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (!book) {
        res.send("Unable to find the book!");
        return;
    }

    
    delete book["reviews"][req.user];
    
    res.send(`Book review with the ISBN ${isbn} updated.`);
});

module.exports.authenticated = regdUsers;
module.exports.isValid = isValid;
module.exports.users = users;
