// src/api/controllers/invoice.controller.js
const invoiceService = require('../services/invoice.service');

// --- Facturas Principales ---

const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.findOne(id);
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

const getInvoicesByClientId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoices = await invoiceService.findByClient(id);
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};

const createInvoice = async (req, res, next) => {
  try {
    const body = req.body;
    const newInvoice = await invoiceService.create(body);
    res.status(201).json(newInvoice);
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedInvoice = await invoiceService.update(id, body);
    res.status(200).json(updatedInvoice);
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    await invoiceService.remove(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// --- Detalles de Factura ---

const getInvoiceDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const details = await invoiceService.findDetails(id);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
};

const addInvoiceDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const newDetail = await invoiceService.addDetail(id, body);
    res.status(201).json(newDetail);
  } catch (error) {
    next(error);
  }
};

const updateInvoiceDetail = async (req, res, next) => {
    try {
        const { invoiceId, detailId } = req.params;
        const body = req.body;
        const updatedDetail = await invoiceService.updateDetail(invoiceId, detailId, body);
        res.status(200).json(updatedDetail);
    } catch (error) {
        next(error);
    }
};

const deleteInvoiceDetail = async (req, res, next) => {
    try {
        const { invoiceId, detailId } = req.params;
        await invoiceService.removeDetail(invoiceId, detailId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};


module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoicesByClientId,
  getInvoiceDetails,
  addInvoiceDetail,
  updateInvoiceDetail,
  deleteInvoiceDetail
};
