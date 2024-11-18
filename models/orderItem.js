// models/orderItem.js
module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id'
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      price: {
        type: DataTypes.FLOAT, // Store the price at the time of order to handle future price changes
        allowNull: false
      }
    });
  
    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, {
          foreignKey: 'orderId',
          as: 'order',
        });
        OrderItem.belongsTo(models.Product, {
          foreignKey: 'productId',
          as: 'product',
        });
      };
    return OrderItem;
  };
  