// src/api/services/product.service.js
const AppError = require('../../utils/AppError');

// Simulación de base de datos en memoria para productos.
// En una aplicación real, aquí irían las llamadas a la base de datos (Ej: PostgreSQL, MongoDB).
const productsDB = [
    { id: 1, nombre: "Laptop Gamer", descripcion: "16GB RAM, RTX 4060", marca: "ASUS", stock: 50 },
    { id: 2, nombre: "Teclado Mecánico", descripcion: "RGB, Switch Azul", marca: "Logitech", stock: 150 }
];
let currentId = 3;

/**
 * La capa de servicio contiene la lógica de negocio pura.
 * No conoce 'req' ni 'res', solo recibe y devuelve datos.
 * Lanza errores que serán capturados por el controlador.
 */

// Devuelve todos los productos. Aquí se implementaría la lógica de filtrado y paginación.
const findAll = async (queryParams) => {
  // TODO: Implementar filtrado por marca, etc.
  return productsDB;
};

// Busca un producto por su ID.
const findOne = async (id) => {
  const product = productsDB.find(p => p.id === parseInt(id));
  if (!product) {
    // Lanza un error personalizado que será manejado por nuestro middleware.
    throw new AppError('Producto no encontrado', 404);
  }
  return product;
};

// Crea un nuevo producto.
const create = async (productData) => {
  if (!productData.nombre || !productData.marca || productData.stock === undefined) {
      throw new AppError('Nombre, marca y stock son requeridos', 400);
  }
  const newProduct = {
    id: currentId++,
    ...productData,
  };
  productsDB.push(newProduct);
  return newProduct;
};

// Actualiza un producto existente.
const update = async (id, productData) => {
  const productIndex = productsDB.findIndex(p => p.id === parseInt(id));
  if (productIndex === -1) {
    throw new AppError('Producto no encontrado para actualizar', 404);
  }
  // Combina el producto existente con los nuevos datos.
  const updatedProduct = { ...productsDB[productIndex], ...productData };
  productsDB[productIndex] = updatedProduct;
  return updatedProduct;
};

// Elimina un producto.
const remove = async (id) => {
  const productIndex = productsDB.findIndex(p => p.id === parseInt(id));
  if (productIndex === -1) {
    throw new AppError('Producto no encontrado para eliminar', 404);
  }
  productsDB.splice(productIndex, 1);
  return true; // Retorna true para confirmar la eliminación.
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  remove,
};

