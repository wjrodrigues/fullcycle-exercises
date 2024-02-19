require("dotenv").config();
const mysql = require("mysql");

module.exports = class RepositoryPeople {
  constructor(db) {
    this.db = db;
  }

  save(name) {
    let connection = this.db.conn();

    connection.connect();

    connection.query(
      "INSERT INTO peoples SET ?",
      { name },
      (err, rows, fields) => {
        connection.end();

        if (err) throw err;
      }
    );
  }

  list() {
    let connection = this.db.conn();

    connection.connect();

    return new Promise((resolve, reject) => {
      connection.query("SELECT id, name FROM peoples ORDER BY id DESC;", (err, rows, fields) => {
        const result = rows.map((r) => {
          return { id: r.id, name: r.name };
        });
        connection.end();

        resolve(result);
      });
    });
  }
};
