// models/settings.js
module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define('Settings', {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      value: {
        type: DataTypes.JSON,
        allowNull: false
      }
    });
  
    return Settings;
  };
  