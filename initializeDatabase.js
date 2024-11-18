const db = require('./models');

const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established.');

    // Ensure tables are created if they don't exist
    await db.User.sync({ force: true }); // Use { force: true } to drop and recreate the table
    await db.Category.sync();
    await db.Product.sync();
    await db.Order.sync(); // Add Order sync

    console.log('Database & tables created or confirmed.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeDatabase();
