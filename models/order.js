module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: { // This might be renamed to paymentStatus if you want to distinguish payment and order statuses.
      type: DataTypes.STRING,
      defaultValue: 'Pending',
    },
    orderStatus: { // New field for order status
      type: DataTypes.STRING,
      defaultValue: 'In Progress', // Default status when an order is placed.
      allowNull: false
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Card', // Default payment method
    },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'customer',
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems',
    });
  };

  return Order;
};
