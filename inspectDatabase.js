const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Specify the path to your SQLite database file
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Open the SQLite database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Error opening the database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');

    // Specifically fetch schema for the 'Orders' table
    console.log(`\nSchema for Orders:`);
    db.all(`PRAGMA table_info('Orders')`, (err, schema) => {
        if (err) {
            console.error('Error fetching schema for table Orders:', err.message);
            return;
        }
        console.log(schema);
    });

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
