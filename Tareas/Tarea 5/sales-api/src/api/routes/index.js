// src/api/routes/index.js
const express = require('express');
const productRoutes = require('./products.routes');
const clientRoutes = require('./clients.routes');
const invoiceRoutes = require('./invoices.routes');

const router = express.Router();

// Este archivo actúa como el enrutador principal de la API.
// Agrega todos los enrutadores de los recursos y los exporta como un solo módulo.

router.use('/products', productRoutes);
router.use('/clients', clientRoutes);
router.use('/invoices', invoiceRoutes);

// Es crucial exportar el router configurado para que app.js pueda usarlo.
module.exports = router;

