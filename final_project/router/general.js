const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const BASE_URL = "https://stefanromanp-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(404).json({ message: "No username provided" });
    }
    if (!password) {
        return res.status(404).json({ message: "No password provided" });
    }

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
// Get book details based on ISBN
// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${BASE_URL}/books/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found with this ISBN", error: error.message });
    }
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        const booksByAuthor = Object.values(response.data).filter(book => book.author === author);

        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Task 13: Get book details based on Title using async/await with Axios
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        const booksByTitle = Object.values(response.data).find(book => book.title === title);

        if (booksByTitle) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No book found by this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book with the given ISBN exists
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        return res.status(200).json(reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
