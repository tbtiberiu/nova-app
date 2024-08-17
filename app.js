import mysql from 'mysql2';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: './.env' });
}

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const publicDirectory = path.join(__dirname, './public');

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index', { isLoggedIn: req.session.isLoggedIn });
});

app.get('/vehicles', (req, res) => {
    res.render('vehicles', { isLoggedIn: req.session.isLoggedIn });
});

app.get('/about', (req, res) => {
    res.render('about', { isLoggedIn: req.session.isLoggedIn });
});

app.get('/contact', (req, res) => {
    res.render('contact', { isLoggedIn: req.session.isLoggedIn });
});

app.get('/login', (req, res) => {
    res.render('login', { isLoggedIn: req.session.isLoggedIn });
});

app.get('/register', (req, res) => {
    res.render('register', { isLoggedIn: req.session.isLoggedIn });
});

app.get('/logout', (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect('/');
});

app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const INSERT_USER_QUERY = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
    db.query(INSERT_USER_QUERY, [firstName, lastName, email, password], (error, result) => {
        if (error) {
            res.status(500).send('Error registering user');
        } else {
            req.session.isLoggedIn = true;
            res.redirect('/');
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.query(SELECT_USER_QUERY, [email, password], (error, result) => {
        if (error || result.length === 0) {
            res.status(401).send('Invalid credentials');
        } else {
            req.session.isLoggedIn = true;
            res.redirect('/');
        }
    });
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
