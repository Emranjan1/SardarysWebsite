const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../database.sqlite'),
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes); // Add Order model
db.OrderItem = require('./orderItem')(sequelize, DataTypes); // Import the OrderItem model
db.CustomerDetails = require('./CustomerDetails')(sequelize, DataTypes); // Add CustomerDetails model
db.Settings = require('./settings')(sequelize, DataTypes); // Make sure 'settings.js' exists in the models directory
db.PromoCode = require('./promoCode')(sequelize, DataTypes); // Import the PromoCode model


// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Synchronize all models with the database
sequelize.sync() // Remove { force: true } to prevent data loss in production
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(error => {
    console.error('Unable to create tables, shutting down...', error);
    process.exit(1);
  });

module.exports = db;
