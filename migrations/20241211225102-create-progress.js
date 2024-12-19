'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Progresses', {
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
      reductionPlanId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ReductionPlans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cigarettesSmoked: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      monetarySavings: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      healthStatus: {
        type: Sequelize.ENUM('ON_TRACK', 'STRUGGLING', 'SUCCESSFUL'),
        defaultValue: 'ON_TRACK'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('Progresses');
  }
};