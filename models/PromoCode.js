// models/PromoCode.js
module.exports = (sequelize, DataTypes) => {
    const PromoCode = sequelize.define('PromoCode', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      discountPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: false
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: false
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    });
  
    return PromoCode;
  };
  