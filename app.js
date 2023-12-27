import mysql from 'mysql2';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');

app.set('views', './views');
app.set('view engine', 'html');

app.use(express.static(publicDirectory));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/vehicles', (req, res) => {
    res.sendFile(__dirname + '/views/vehicles.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/views/contact.html');
});

db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
    } else {
        console.log('Connected to MySQL database!');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

db.end();

// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');

// const app = express();

// // MySQL Connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'your_mysql_username',
//     password: 'your_mysql_password',
//     database: 'your_database_name'
// });

// // Connect
// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('MySQL Connected...');
// });

// // Body Parser Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Set up views directory
// app.set('views', './views');
// app.set('view engine', 'html');

// // Serve static files
// app.use(express.static('public'));

// // Route for homepage
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/login.html');
// });

// // Route for registration page
// app.get('/register', (req, res) => {
//     res.sendFile(__dirname + '/views/register.html');
// });

// // Registration POST route
// app.post('/register', (req, res) => {
//     const { username, password } = req.body;
//     const INSERT_USER_QUERY = `INSERT INTO users (username, password) VALUES (?, ?)`;
//     db.query(INSERT_USER_QUERY, [username, password], (err, result) => {
//         if (err) {
//             res.status(500).send('Error registering user');
//         } else {
//             res.redirect('/');
//         }
//     });
// });

// // Login POST route
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const SELECT_USER_QUERY = `SELECT * FROM users WHERE username = ? AND password = ?`;
//     db.query(SELECT_USER_QUERY, [username, password], (err, result) => {
//         if (err || result.length === 0) {
//             res.status(401).send('Invalid credentials');
//         } else {
//             res.send('Login successful!');
//         }
//     });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
