const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbPath = 'C:/Users/emr00083/sardarys-website/website/database.sqlite';

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found:', dbPath);
  process.exit(1);
}

const adminEmail = 'Mohammed_sardary@hotmail.com';
const adminPassword = 'Sardarylawda123';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    checkAndInsertAdminUser();
  }
});

const checkAndInsertAdminUser = async () => {
  db.get('SELECT * FROM Users WHERE email = ?', [adminEmail], async (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      return;
    }

    if (row) {
      console.log('Admin user already exists:', row);
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        }
        console.log('Closed the database connection.');
      });
      return;
    }

    console.log('Admin user not found, creating a new one.');

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

      const sql = `INSERT INTO Users (firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country, password, isAdmin, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;

      db.run(sql, ['Admin', 'User', adminEmail, '1234567890', '123 Main St', '', '12345', 'London', 'United Kingdom', hashedPassword, 1], function (err) {
        if (err) {
          return console.error('Error inserting admin user:', err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        }
        console.log('Closed the database connection.');
      });
    }
  });
};
