const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const setupAssociations = require('./models/associations');
const authRoutes = require('./routes/authRoutes');
const reductionRoutes = require('./routes/reductionRoutes');
const { sequelize, testConnection } = require('./config/database');

// Configuración de variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reduction', reductionRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await testConnection();

        // Configurar asociaciones
        setupAssociations();

        // Sincronizar modelos
        await sequelize.sync({ 
            alter: false,
            logging: console.log 
        });

        // Configurar puerto
        const PORT = process.env.PORT || 3005;

        // Iniciar servidor
        app.listen(PORT, (err) => {
            if(err) {
                console.error(err.message);
            } else {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`Modo: ${process.env.NODE_ENV}`);
        }
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Manejo de errores no controlados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo no manejado:', promise, 'reason:', reason);
    process.exit(1); 
});

process.on('uncaughtException', (error) => {
    console.error('Error no manejado:', error);
    process.exit(1); 
});

// Iniciar servidor
startServer();