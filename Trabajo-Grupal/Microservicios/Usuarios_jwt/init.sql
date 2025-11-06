CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar un usuario admin por defecto (password: Admin123!)
INSERT INTO users (email, password, full_name, role) VALUES 
('admin@example.com', '$2b$10$8vZ5o5mXHqYqYqYqYqYqYu5X5X5X5X5X5X5X5X5X5X5X5X5X5X5Xm', 'Administrador', 'admin');

-- Nota: La contraseña hasheada arriba es solo un placeholder
-- El sistema generará el hash correcto al crear usuarios