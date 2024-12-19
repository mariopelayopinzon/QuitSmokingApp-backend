const { sequelize } = require('../config/database.js');
const { DataTypes } = require('sequelize');

const ReductionPlan = sequelize.define('ReductionPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },  
  startCigarettes: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }, 
  targetCigarettes: { 
    type: DataTypes.INTEGER, 
    allowNull: false
  }, 
  startDate: {
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW
  }
},{
  timestamps: true,
  paranoid: true
});

module.exports = ReductionPlan; 