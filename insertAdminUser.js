const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER, // Replace with your MySQL username
  password: process.env.DB_PASSWORD, // Replace with your MySQL password
  database: process.env.DB_NAME, // Replace with your database name
};

// Admin details
const adminEmail = 'Mohammed_sardary@hotmail.com';
const adminPassword = 'Sardarylawda123';

const checkAndInsertAdminUser = async () => {
  let connection;

  try {
    // Connect to the database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the MySQL database.');

    // Check if the admin user already exists
    const [rows] = await connection.execute('SELECT * FROM Users WHERE email = ?', [adminEmail]);

    if (rows.length > 0) {
      console.log('Admin user already exists:', rows[0]);
      return;
    }

    console.log('Admin user not found, creating a new one.');

    // Hash the admin password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Insert the admin user into the database
    const sql = `
      INSERT INTO Users (firstName, lastName, email, phone, addressLine1, addressLine2, postalCode, city, country, password, isAdmin, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    const values = [
      'Admin', 'User', adminEmail, '1234567890', '123 Main St', '', '12345', 'London', 'United Kingdom', hashedPassword, 1,
    ];

    const [result] = await connection.execute(sql, values);
    console.log(`Admin user created with ID: ${result.insertId}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      // Close the database connection
      await connection.end();
      console.log('Closed the database connection.');
    }
  }
};

// Run the function
checkAndInsertAdminUser();
