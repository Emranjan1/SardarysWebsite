// models/promoCodeUsage.js
module.exports = (sequelize, DataTypes) => {
    const PromoCodeUsage = sequelize.define('PromoCodeUsage', {
      userId: DataTypes.INTEGER,
      promoCodeId: DataTypes.INTEGER,
    });
    
    return PromoCodeUsage;
  };
  