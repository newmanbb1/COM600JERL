const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(express.static('public'));

// Conexión a MongoDB
// Usamos 'mongodb' como hostname porque así se llamará nuestro servicio en Docker Compose
const dbUrl = 'mongodb://mongodb:27017/tasksdb';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.error('No se pudo conectar a MongoDB...', err));

// Rutas
const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.send('¡API de Tareas funcionando!');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});