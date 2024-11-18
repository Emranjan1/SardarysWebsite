const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Specify the path to your SQLite database file
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening the database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');

    // Query to fetch products
    const query = `SELECT * FROM Products WHERE id IN (1, 2);`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return;
        }
        if (rows.length > 0) {
            console.log("Found Products:", rows);
        } else {
            console.log("No products found with IDs 1 or 2.");
        }
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
