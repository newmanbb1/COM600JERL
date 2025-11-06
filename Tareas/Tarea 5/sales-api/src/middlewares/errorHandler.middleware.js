// src/middlewares/errorHandler.middleware.js
const AppError = require('../utils/AppError');

// Middleware para registrar errores en la consola (útil para depuración)
function logErrors(err, req, res, next) {
  console.error(err);
  next(err); // Pasa el error al siguiente middleware
}

// Middleware para manejar errores y enviar una respuesta al cliente.
// Nota: debe tener 4 parámetros para ser identificado como un manejador de errores.
function errorHandler(err, req, res, next) {
  // Si el error es una instancia de nuestra clase de error personalizada...
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Para cualquier otro tipo de error, enviamos un error 500 genérico.
  return res.status(500).json({
    status: 'fail',
    message: 'Algo salió muy mal en el servidor.',
  });
}

// Exportamos ambas funciones. Esto es crucial.
module.exports = {
  logErrors,
  errorHandler,
};

