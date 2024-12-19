'use strict'; 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false, 
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
      }, 
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    startCigarettes: {
      type: Sequelize.INTEGER,
      allowNull: false
    }, 
    targetCigarettes: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true
    }, 
    status: {
      type: Sequelize.ENUM('ACTIVE', 'COMPLETED', 'PAUSED'),
      defaultValue: 'ACTIVE' 
    }, 
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    }, 
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users'); 
  }
};