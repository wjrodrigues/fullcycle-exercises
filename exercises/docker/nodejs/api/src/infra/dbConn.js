require("dotenv").config();

const mysql = require("mysql");

module.exports = class DB {
  constructor() {}

  conn() {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    return connection;
  }
};
