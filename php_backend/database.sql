CREATE DATABASE IF NOT EXISTS medicheck_db;
USE medicheck_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categorias_favoritos (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    termino_busqueda VARCHAR(255) NOT NULL,
    notas_usuario TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias_favoritos(id) ON DELETE CASCADE
);

-- Mock Data para probar los endpoints
INSERT INTO usuarios (nombre, email) VALUES ('Juan Perez', 'juan@example.com') ON DUPLICATE KEY UPDATE id=id;
INSERT INTO categorias_favoritos (id, nombre) VALUES (1, 'Condición Médica'), (2, 'Síntoma'), (3, 'Búsqueda General') ON DUPLICATE KEY UPDATE id=id;
