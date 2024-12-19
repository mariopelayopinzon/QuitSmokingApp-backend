const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  }, 
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW
  }, 
  cigarettesSmoked: {
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      min: 0,
      max: 50
    }
  },
  daysSinceQuit: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  moneySaved: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  healthImprovement: {
    type: DataTypes.INTEGER,
    defaultValue: 0, 
    validate: {
      min: 0, 
      max: 100
    }
  },
  cigarettesAvoided: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }, 
  quitDate: {
    type: DataTypes.DATE,
    allowNull: true
  }, 
  motivationLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'), 
    defaultValue: 'medium'
  }, 
  challenges: {
    type: DataTypes.JSON, 
    defaultValue: []
  }, 
  rewards: {
    type: DataTypes.JSON,
    defaultValue: []
  }
},{
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeCreate: (progress) => {
      // Cálculos automáticos al crear
      if (progress.quitDate) {
        const today = new Date();
        const quitDate = new Date(progress.quitDate);
        progress.daysSinceQuit = Math.floor((today - quitDate) / (1000 * 60 * 60 * 24));
      }
    },
    beforeUpdate: (progress) => {
      // Cálculos automáticos al actualizar
      if (progress.quitDate) {
        const today = new Date();
        const quitDate = new Date(progress.quitDate);
        progress.daysSinceQuit = Math.floor((today - quitDate) / (1000 * 60 * 60 * 24));
      }
    }
  },
  scopes: {
    // Scopes personalizados
    recent(userId) {
      return {
        where: {
          userId: userId
        },
        order: [['date', 'DESC']],
        limit: 30
      }
    },
    byMotivation(level) {
      return {
        where: {
          motivationLevel: level
        }
      }
    }
  }
});

// Asociaciones
Progress.associate = (models) => {
  Progress.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Progress;