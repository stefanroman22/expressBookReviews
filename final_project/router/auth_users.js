const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Add a review for testing
books[1].reviews = {
    "testuser": "This is a great book! - testuser",
    "anotheruser": "I didn’t enjoy it as much. - anotheruser"
};

// Rest of the code remains the same (users, isValid, authenticatedUser, routes, etc.)
let users = [
    { username: "testuser", password: "testpass" }
];

// Check if the username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if the username and password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", token });
});

// Add or update a book review (placeholder)
regd_users.put("/auth/review/:isbn", (req, res) => {
    return res.status(501).json({ message: "Endpoint not yet implemented" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(' ')[1];
    let username;
    try {
        const decoded = jwt.verify(token, "your_secret_key");
        username = decoded.username;
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    delete books[isbn].reviews[username];
    if (Object.keys(books[isbn].reviews).length === 0) {
        books[isbn].reviews = {};
    }

    return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} deleted successfully` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;