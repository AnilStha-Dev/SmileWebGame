//importing sql module
const mysql = require("mysql");

//mysql database connection
conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "smile"
});

conn.connect((err) => {
    if (err) throw err;
    else {
        console.log("Database connected!");
    }
});

module.exports = conn;