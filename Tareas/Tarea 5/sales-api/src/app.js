// src/app.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const apiRoutes = require('./api/routes');
const { logErrors, errorHandler } = require('./middlewares/errorHandler.middleware');
const AppError = require('./utils/AppError');

const app = express();

// Middlewares básicos
app.use(cors()); // Habilita Cross-Origin Resource Sharing
app.use(express.json()); // Permite a Express entender body en formato JSON

// Cargar la documentación de Swagger
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Ruta principal
app.get('/', (req, res) => {
  res.send('Welcome to the Sales API! Go to /api-docs for documentation.');
});

// Rutas de la API
app.use('/api/v1', apiRoutes);

// Ruta para la documentación de la API con Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para manejar rutas no encontradas (404)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Middlewares de manejo de errores. Deben ir al final.
app.use(logErrors);
app.use(errorHandler);

module.exports = app;