const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Replace with the correct path to your SQLite database file
const dbPath = 'C:/Users/emr00083/sardarys-website/website/database.sqlite';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    checkUsersTable();
  }
});

const checkUsersTable = () => {
  const sql = `PRAGMA table_info(Users)`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error('Error checking table info:', err.message);
    }
    console.log('Users table schema:', rows);
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      }
      console.log('Closed the database connection.');
    });
  });
};
