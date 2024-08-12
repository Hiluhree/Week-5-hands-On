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
});

// create a database

db.query(`CREATE DATABASE IF NOT EXISTS my_expense_tracker`, (err, result) => {
    if(err) return console.log(log);

    console.log("Database created successfully");
});

app.get('', function(req, res){
    res.send("Hello Hillary, What are you learning today? Please learn express");
});

app.listen(3000, () => {
    console.log("Server us running at port 3000");
});