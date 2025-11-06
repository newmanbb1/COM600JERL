require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mysql = require('mysql2/promise');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// --- 1. Configuración de Conexión gRPC (Cliente) ---
// Ruta a nuestro archivo .proto
const PROTO_PATH = path.join(__dirname, 'proto', 'vehiculos.proto');
// Host del servicio de vehículos (el nombre en Docker Compose)
const GRPC_HOST = process.env.GRPC_HOST || 'servicio-vehiculos:50051';

// Opciones para el proto-loader
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

// Cargamos el paquete
const vehiculosProto = grpc.loadPackageDefinition(packageDefinition).vehiculos;

// Creamos el cliente gRPC
// Usamos 'insecure' porque estamos dentro de la red interna de Docker
const grpcClient = new vehiculosProto.VehiculoServicio(
    GRPC_HOST,
    grpc.credentials.createInsecure()
);

// --- 2. Configuración de MySQL ---
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db-envios',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mi-password-secreto',
    database: process.env.DB_NAME || 'envios_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// (Opcional) Auto-crear la tabla si no existe
const initMySQL = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS envios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                vehiculos_id VARCHAR(255) NOT NULL,
                origen VARCHAR(255) NOT NULL,
                destino VARCHAR(255) NOT NULL,
                fecha_envio DATETIME NOT NULL,
                estado VARCHAR(50) DEFAULT 'pendiente'
            );
        `);
        connection.release();
        console.log('[Servicio Envíos] Tabla "envios" lista en MySQL.');
    } catch (error) {
        console.error('[Servicio Envíos] Error al inicializar MySQL:', error.message);
    }
};

// --- 3. Definición de GraphQL (Schema) ---
const typeDefs = gql`
    type Envio {
        id: ID!
        usuario_id: Int!
        vehiculos_id: String!
        origen: String!
        destino: String!
        fecha_envio: String!
        estado: String!
    }

    type Query {
        envios: [Envio!]!
        envio(id: ID!): Envio
    }

    type Mutation {
        crearEnvio(
            usuario_id: Int!, 
            vehiculos_id: String!, 
            origen: String!, 
            destino: String!
        ): Envio!

        actualizarEstadoEnvio(id: ID!, estado: String!): Envio
    }
`;

// --- 4. Resolvers (Lógica de GraphQL) ---
const resolvers = {
    Query: {
        envios: async () => {
            const [rows] = await pool.query('SELECT * FROM envios');
            return rows;
        },
        envio: async (_, { id }) => {
            const [rows] = await pool.query('SELECT * FROM envios WHERE id = ?', [id]);
            return rows[0];
        }
    },
    Mutation: {
        // --- ¡ESTA ES LA LÓGICA CLAVE! ---
        crearEnvio: async (_, { usuario_id, vehiculos_id, origen, destino }) => {
            
            // 1. Verificar disponibilidad del vehículo via gRPC
            console.log(`[gRPC Client] Verificando vehículo: ${vehiculos_id}`);
            
            const disponibilidad = await new Promise((resolve, reject) => {
                grpcClient.VerificarDisponibilidad({ vehiculo_id }, (err, response) => {
                    if (err) {
                        console.error("[gRPC Client] Error:", err.message);
                        return reject(new Error(`Error al contactar servicio de vehículos: ${err.message}`));
                    }
                    resolve(response.disponible);
                });
            });

            // 2. Tomar la decisión
            if (!disponibilidad) {
                console.warn(`[gRPC Client] Vehículo ${vehiculos_id} no disponible.`);
                // Lanzamos un error que Apollo enviará al cliente
                throw new Error('El vehículo seleccionado no está disponible.');
            }

            console.log(`[gRPC Client] Vehículo ${vehiculos_id} SÍ está disponible.`);

            // 3. Crear el envío en MySQL
            const newEnvio = {
                usuario_id,
                vehiculos_id,
                origen,
                destino,
                fecha_envio: new Date(),
                estado: 'pendiente'
            };

            const [result] = await pool.query('INSERT INTO envios SET ?', newEnvio);
            
            return {
                id: result.insertId,
                ...newEnvio
            };
        },

        actualizarEstadoEnvio: async (_, { id, estado }) => {
            await pool.query('UPDATE envios SET estado = ? WHERE id = ?', [estado, id]);
            const [rows] = await pool.query('SELECT * FROM envios WHERE id = ?', [id]);
            return rows[0];
        }
    }
};

// --- 5. Iniciar Servidor Apollo y Express ---
async function startServer() {
    const app = express();
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });

    const port = process.env.PORT || 3003;
    app.listen(port, async () => {
        await initMySQL(); // Prepara la base de datos
        console.log(`[Servicio Envíos] Servidor GraphQL corriendo en http://localhost:${port}/graphql`);
    });
}

startServer();