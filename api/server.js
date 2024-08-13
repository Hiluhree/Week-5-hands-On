const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3307
});

db.connect((err) => {
    if (err) return console.log("Error Connecting to DB")
    console.log("Connected to DB: ", db.threadId);


    // create a database
    db.query(`CREATE DATABASE IF NOT EXISTS my_expense_tracker`, (err, result) => {
        if (err) return console.log(log);

        console.log("Database created successfully");

        // select the database
        db.changeUser({ database: 'my_expense_tracker' }, (err) => {
            if (err) return console.log(err);
            console.log("database changed to my_expense_tracker");
            // create users table
            const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
            `;

            db.query(createUsersTable, (err, result) => {
                if (err) return console.log(err);

                console.log('Table created successfully');
            });
        });

    });
});

// user registration route
app.post('/api/register', async (req, res) => {
    try {
        const users = `SELECT * FROM users WHERE email = ?`;

        db.query(users, [req.body.email], (err, data) => {
            if (data.length) return res.status(409).json("User already exists");

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            const newUser = `INSERT INTO users(email, username, password) VALUES(?)`
            value = [
                req.body.email,
                req.body.username,
                hashedPassword
            ]

            // insert into the database
            db.query(newUser, [value], (err, data) => {
                if (err) return res.status(500).json("Something went wromg");

                return res.status(200).json("User created successfully");
            })
        })

    }
    catch (err) {
        res.status(500).json("Internal Server Error");
    }
});

// user login
app.post('/api/login', async (rq, res) => {
    try {
        const users = `SELECT * FROM users WHERE email = ?`;
        db.query(users, [req.body.email], (err, data) => {
        if(data.length === 0) return res.status(404).json("User not found");
        // Check is password is valid

        const isPasswordValid = bcrypt.compareSync(req.body.password,data[0].password)

        if(!isPasswordValid) return res.status(400).json("Ivalid email or password");

        res.status(200).json("Login Successful");

        })
    } catch (err) {
        res.status(500).json("Internal Server Error");
    }
})

app.listen(3000, () => {
    console.log("Server us running at port 3000");
});