const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2/promise");

const sequelize = new Sequelize('sardarys', 'ERahmat', 'Emranjan1415', {
  host: 'sardarys-db.cja4o6c6k14c.eu-west-2.rds.amazonaws.com', // Update this if using a remote host
  port: 3306, //DB por (e.g: 3306 for MySQL)
  dialect: "mysql", // Change dialect to 'mysql'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, DataTypes);
db.Product = require("./product")(sequelize, DataTypes);
db.Category = require("./category")(sequelize, DataTypes);
db.Order = require("./order")(sequelize, DataTypes); // Add Order model
db.OrderItem = require("./orderItem")(sequelize, DataTypes); // Import the OrderItem model
db.CustomerDetails = require("./CustomerDetails")(sequelize, DataTypes); // Add CustomerDetails model
db.Settings = require("./settings")(sequelize, DataTypes); // Make sure 'settings.js' exists in the models directory
db.PromoCode = require("./promoCode")(sequelize, DataTypes); // Import the PromoCode model

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Synchronize all models with the database
sequelize
  .sync() // Remove { force: true } to prevent data loss in production
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Unable to create tables, shutting down...", error);
    process.exit(1);
  });

module.exports = db;