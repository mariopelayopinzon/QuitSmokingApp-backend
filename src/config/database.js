const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 6000,
        dialect: 'postgres',
        // logging: console.log, 
        // // dialectOptions: {
        // // //     connectTimeout: 10000,
        // // //     ssl: process.env.DB_SSL === 'true' 
        // // //         ? { 
        // // //             require: true,
        // // //             rejectUnauthorized: false 
        // // //         } 
        // // //         : false
        // // // },
        // logging: false // Desactiva los logs de SQL si no los necesitas
    }
);

const testConnection = async () => {
    try {
        console.log('Intentando conectar a PostgreSQL...');
        console.log('Configuracion de conexion', {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        await sequelize.authenticate();
        console.log('✅ Conectado a PostgreSQL correctamente');
    } catch (error) {
        console.error('❌ Error al conectar a PostgreSQL:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
};

const syncDatabase = async () => {
    try {
        // Sincroniza todos los modelos definidos
        await sequelize.sync({
            // alter: true // Usa esta opción con cuidado en producción
        });
        console.log('📦 Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('Error al sincronizar modelos:', error);
        throw error;
    }
};

const closeConnection = async () => {
    try {
        await sequelize.close();
        console.log('📴 Conexión a PostgreSQL cerrada.');
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
    }
};

module.exports = {
    sequelize,
    testConnection,
    syncDatabase,
    closeConnection
};