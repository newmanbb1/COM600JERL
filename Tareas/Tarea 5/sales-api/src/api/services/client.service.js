// src/api/services/client.service.js
const AppError = require('../../utils/AppError');

// Simulación de base de datos en memoria para clientes.
const clientsDB = [
    { id: 1, ci: "1234567", nombres: "Juan", apellidos: "Perez", sexo: "M" },
    { id: 2, ci: "9876543", nombres: "Ana", apellidos: "García", sexo: "F" }
];
let currentId = 3;

// Devuelve todos los clientes.
const findAll = async (queryParams) => {
  return clientsDB;
};

// Busca un cliente por su ID.
const findOne = async (id) => {
  const client = clientsDB.find(c => c.id === parseInt(id));
  if (!client) {
    throw new AppError('Cliente no encontrado', 404);
  }
  return client;
};

// Crea un nuevo cliente.
const create = async (clientData) => {
  if (!clientData.ci || !clientData.nombres || !clientData.apellidos) {
      throw new AppError('CI, nombres y apellidos son requeridos', 400);
  }
  const newClient = {
    id: currentId++,
    ...clientData,
  };
  clientsDB.push(newClient);
  return newClient;
};

// Actualiza un cliente existente.
const update = async (id, clientData) => {
  const clientIndex = clientsDB.findIndex(c => c.id === parseInt(id));
  if (clientIndex === -1) {
    throw new AppError('Cliente no encontrado para actualizar', 404);
  }
  const updatedClient = { ...clientsDB[clientIndex], ...clientData };
  clientsDB[clientIndex] = updatedClient;
  return updatedClient;
};

// Elimina un cliente.
const remove = async (id) => {
  const clientIndex = clientsDB.findIndex(c => c.id === parseInt(id));
  if (clientIndex === -1) {
    throw new AppError('Cliente no encontrado para eliminar', 404);
  }
  clientsDB.splice(clientIndex, 1);
  return true;
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  remove,
};

