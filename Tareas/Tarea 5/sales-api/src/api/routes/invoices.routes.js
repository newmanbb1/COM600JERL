// src/api/routes/invoices.routes.js
const express = require('express');
const invoiceController = require('../controllers/invoice.controller');

const router = express.Router();

router.route('/')
  .get(invoiceController.getAllInvoices)
  .post(invoiceController.createInvoice);

router.route('/:id')
  .get(invoiceController.getInvoiceById)
  .put(invoiceController.updateInvoice)
  .delete(invoiceController.deleteInvoice);

// Rutas para los detalles de una factura
router.route('/:id/details')
  .get(invoiceController.getInvoiceDetails)
  .post(invoiceController.addInvoiceDetail);

router.route('/:invoiceId/details/:detailId')
  .put(invoiceController.updateInvoiceDetail)
  .delete(invoiceController.deleteInvoiceDetail);

module.exports = router;
