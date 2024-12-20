'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('users'); 

    console.log('Columnas actuales:', Object.keys(tableInfo));

    const transaction = await queryInterface.sequelize.transaction(); 

    try {
      // Verificar y añadir columnas si no existen
      if (!tableInfo.cigarettesPerDay) {
        await queryInterface.addColumn('users', 'cigarettesPerDay', {
          type: Sequelize.INTEGER,
          defaultValue: 0, 
          allowNull: true
        }, { transaction });
      }

      // Añadir nueva columna smokingStartAge
      if (!tableInfo.smokingStartAge) {
        await queryInterface.addColumn('users', 'smokingStartAge', {
          type: Sequelize.INTEGER,
          defaultValue: null,
          allowNull: true,
          validate: {
            min: 0,
            max: 100
          }
        }, { transaction });
      }

      // Confirmar transacción
      await transaction.commit();
    } catch (error) {
      // Revertir en caso de error
      await transaction.rollback();
      throw error; 
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Eliminar columnas si se requiere deshacer la migración
      await queryInterface.removeColumn('users', 'smokingStartAge', { transaction });
      await queryInterface.removeColumn('users', 'cigarettesPerDay', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};