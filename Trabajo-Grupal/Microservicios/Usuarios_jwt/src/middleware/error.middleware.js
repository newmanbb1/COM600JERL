const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'El recurso ya existe'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      error: 'Referencia inválida'
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Error interno del servidor'
  });
};

module.exports = { errorHandler };