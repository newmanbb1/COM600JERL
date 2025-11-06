// src/api/services/invoice.service.js
const AppError = require('../../utils/AppError');
const clientService = require('./client.service'); // Importamos el servicio de cliente para validaciones.
const productService = require('./product.service'); // Importamos para validar productos.

// Simulación de base de datos para facturas y sus detalles.
const invoicesDB = [
    { 
        id: 101, 
        fecha: "2025-09-04", 
        cliente_id: 1, 
        total: 151.00,
        detalles: [
            { id: 1, producto_id: 2, cantidad: 2, precio: 75.50, subtotal: 151.00 }
        ] 
    }
];
let invoiceIdCounter = 102;
let detailIdCounter = 2;

// --- Lógica de Facturas ---

const findAll = async () => invoicesDB;

const findOne = async (id) => {
    const invoice = invoicesDB.find(inv => inv.id === parseInt(id));
    if (!invoice) throw new AppError('Factura no encontrada', 404);
    return invoice;
};

const findByClient = async (clientId) => {
    await clientService.findOne(clientId); // Validamos que el cliente exista.
    return invoicesDB.filter(inv => inv.cliente_id === parseInt(clientId));
};

const create = async (invoiceData) => {
    const { cliente_id, fecha } = invoiceData;
    if (!cliente_id || !fecha) {
        throw new AppError('El ID del cliente y la fecha son requeridos', 400);
    }
    await clientService.findOne(cliente_id); // Validamos que el cliente exista.

    const newInvoice = {
        id: invoiceIdCounter++,
        fecha,
        cliente_id: parseInt(cliente_id),
        total: 0,
        detalles: []
    };
    invoicesDB.push(newInvoice);
    return newInvoice;
};

const update = async (id, invoiceData) => {
    const invoice = await findOne(id);
    // Si se intenta cambiar el cliente, validamos que el nuevo cliente exista.
    if (invoiceData.cliente_id) await clientService.findOne(invoiceData.cliente_id);
    
    Object.assign(invoice, invoiceData);
    return invoice;
};

const remove = async (id) => {
    const index = invoicesDB.findIndex(inv => inv.id === parseInt(id));
    if (index === -1) throw new AppError('Factura no encontrada', 404);
    invoicesDB.splice(index, 1);
    return true;
};

// --- Lógica de Detalles de Factura ---

const findDetails = async (invoiceId) => {
    const invoice = await findOne(invoiceId);
    return invoice.detalles;
};

const addDetail = async (invoiceId, detailData) => {
    const { producto_id, cantidad, precio } = detailData;
    if (!producto_id || !cantidad || !precio) {
        throw new AppError('ID del producto, cantidad y precio son requeridos', 400);
    }
    await productService.findOne(producto_id); // Validamos que el producto exista.
    const invoice = await findOne(invoiceId);

    const newDetail = {
        id: detailIdCounter++,
        producto_id: parseInt(producto_id),
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
        subtotal: parseInt(cantidad) * parseFloat(precio)
    };
    invoice.detalles.push(newDetail);
    // Recalculamos el total de la factura
    invoice.total = invoice.detalles.reduce((acc, detail) => acc + detail.subtotal, 0);
    return newDetail;
};

const updateDetail = async (invoiceId, detailId, detailData) => {
    const invoice = await findOne(invoiceId);
    const detailIndex = invoice.detalles.findIndex(d => d.id === parseInt(detailId));
    if (detailIndex === -1) throw new AppError('Detalle de factura no encontrado', 404);

    const updatedDetail = { ...invoice.detalles[detailIndex], ...detailData };
    // Recalcular subtotal si cambia cantidad o precio
    if (detailData.cantidad || detailData.precio) {
        updatedDetail.subtotal = (updatedDetail.cantidad) * (updatedDetail.precio);
    }
    invoice.detalles[detailIndex] = updatedDetail;
    // Recalculamos el total de la factura
    invoice.total = invoice.detalles.reduce((acc, detail) => acc + detail.subtotal, 0);
    return updatedDetail;
};

const removeDetail = async (invoiceId, detailId) => {
    const invoice = await findOne(invoiceId);
    const detailIndex = invoice.detalles.findIndex(d => d.id === parseInt(detailId));
    if (detailIndex === -1) throw new AppError('Detalle de factura no encontrado', 404);

    invoice.detalles.splice(detailIndex, 1);
    // Recalculamos el total de la factura
    invoice.total = invoice.detalles.reduce((acc, detail) => acc + detail.subtotal, 0);
    return true;
};

module.exports = {
  findAll, findOne, create, update, remove, findByClient,
  findDetails, addDetail, updateDetail, removeDetail
};

