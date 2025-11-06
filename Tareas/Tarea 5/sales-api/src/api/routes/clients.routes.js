// src/api/routes/clients.routes.js
const express = require('express');
const clientController = require('../controllers/client.controller');
const invoiceController = require('../controllers/invoice.controller');

const router = express.Router();

router.route('/')
  .get(clientController.getAllClients)
  .post(clientController.createClient);

router.route('/:id')
  .get(clientController.getClientById)
  .put(clientController.updateClient)
  .delete(clientController.deleteClient);

// Ruta anidada para obtener las facturas de un cliente específico
router.get('/:id/invoices', invoiceController.getInvoicesByClientId);


module.exports = router;
