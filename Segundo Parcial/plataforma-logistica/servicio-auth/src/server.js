// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Configuración Inicial ---
const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET;

// Middleware para parsear JSON
app.use(express.json());

// --- Configuración de la Base de Datos ---
// Creamos un "pool" de conexiones, que es más eficiente
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- Endpoint de Login ---
// Implementa: POST /login
app.post('/login', async (req, res) => {
    const { correo, password } = req.body;

    // 1. Validar entrada
    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    }

    try {
        // 2. Buscar al usuario en la BD
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            // Error genérico por seguridad (no decir "usuario no existe")
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const user = rows[0];

        // 3. Comparar la contraseña (usando bcrypt)
        // Nota: Asumimos que la contraseña en la BD está hasheada
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 4. Crear el JWT
        const payload = {
            id: user.id,
            correo: user.correo
            // Puedes añadir más datos al token si lo deseas (ej. roles)
        };

        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: '1h' // El token expira en 1 hora
        });

        // 5. Devolver el token
        res.status(200).json({
            message: 'Autenticación exitosa',
            token: token
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint de health-check (para saber si el servicio está vivo)
app.get('/health', (req, res) => {
    res.status(200).send('Servicio de autenticación OK');
});


// --- Iniciar el Servidor ---
app.listen(port, () => {
    console.log(`[Servicio Auth] Escuchando en el puerto ${port}`);
});