'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const tableInfo = await queryInterface.describeTable('users'); 

    console.log('Columnas actuales:', Object.keys(tableInfo));

    const transaction = await queryInterface.sequelize.transaction(); 

    try {
      if (!tableInfo.cigarettesPerDay) {
        await queryInterface.addColumn('users', 'cigarettesPerDay', {
          type: sequelize.INTEGER,
          defaultValue: 0, 
          allowNull: true
        }, { transaction });

        await transaction.commit();
      }
    } catch (error) {
      await transaction.rollback();
      throw error; 
      
    }
    // Transacción para seguridad

    try {
      // Crear tabla
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        cigarettesPerDay: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      }, { transaction });

      // Crear índices
      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        transaction
      });

      await queryInterface.addIndex('users', ['username'], {
        unique: true,
        transaction
      });

      // Confirmar transacción
      await transaction.commit();
    } catch (error) {
      // Revertir en caso de error
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};