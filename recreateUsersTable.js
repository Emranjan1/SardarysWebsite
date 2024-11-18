const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Replace with the correct path to your SQLite database file
const dbPath = 'C:/Users/emr00083/sardarys-website/website/database.sqlite';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    recreateUsersTable();
  }
});

const recreateUsersTable = () => {
  const sqlDrop = `DROP TABLE IF EXISTS Users`;
  const sqlCreate = `CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    addressLine1 VARCHAR(255),
    addressLine2 VARCHAR(255),
    postalCode VARCHAR(20),
    city VARCHAR(255),
    country VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    isAdmin TINYINT(1) DEFAULT 0,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
  )`;

  db.run(sqlDrop, [], (err) => {
    if (err) {
      return console.error('Error dropping table:', err.message);
    }
    db.run(sqlCreate, [], (err) => {
      if (err) {
        return console.error('Error creating table:', err.message);
      }
      console.log('Users table recreated.');
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        }
        console.log('Closed the database connection.');
      });
    });
  });
};
