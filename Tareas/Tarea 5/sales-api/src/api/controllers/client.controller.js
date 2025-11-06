// src/api/controllers/client.controller.js
const clientService = require('../services/client.service');

const getAllClients = async (req, res, next) => {
  try {
    const clients = await clientService.findAll(req.query);
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await clientService.findOne(id);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const body = req.body;
    const newClient = await clientService.create(body);
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedClient = await clientService.update(id, body);
    res.status(200).json(updatedClient);
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    await clientService.remove(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
