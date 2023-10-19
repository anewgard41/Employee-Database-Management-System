const mysql = require("mysql2");
require("dotenv").config();


const connection = mysql.createConnection({
    // Using a .env file to hide sensitive information: username, password, and database name. 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;