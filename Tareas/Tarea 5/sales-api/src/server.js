// src/server.js
const app = require('./app');

// Define el puerto del servidor. Prioriza el puerto definido en las variables de entorno.
const PORT = process.env.PORT || 3000;

// Inicia el servidor y lo pone a escuchar en el puerto especificado.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger Docs available on http://localhost:${PORT}/api-docs`);
});
