// src/api/controllers/product.controller.js
const productService = require('../services/product.service');

// Controlador para gestionar las operaciones de los productos
// Cada función es un "async middleware" que captura errores y los pasa a next()
const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.findAll(req.query);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.findOne(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    const newProduct = await productService.create(body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedProduct = await productService.update(id, body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.remove(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
