// models/product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: { // Add this new field
      type: DataTypes.TEXT,
      allowNull: true, // Set as nullable if you don't require it for all products
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ageVerificationRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allows null for backward compatibility
      defaultValue: 0  // Default sorting value
    }
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  };

  return Product;
};
