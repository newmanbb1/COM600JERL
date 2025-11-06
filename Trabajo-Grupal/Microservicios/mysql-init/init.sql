-- init.sql FINAL
USE usuarios_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE, -- <-- ESTA ES LA LÍNEA NUEVA
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);