-- =====================================================
-- SCRIPT DE BASE DE DATOS PARA SISTEMA DE FICHAJE
-- =====================================================

-- Crear la base de datos
CREATE DATABASE "mbedb"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectarse a la base de datos
\c "mbedb";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50),
    employee_id VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de registros de fichaje
CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    date DATE DEFAULT CURRENT_DATE,
    qr_code VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de códigos QR
CREATE TABLE IF NOT EXISTS qr_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);

-- Insertar datos de ejemplo
INSERT INTO users (name, email, phone, employee_id) VApoLUES
('Admin User', 'admin@mbe.madrid', '+34674526278', 'EMP001')
ON CONFLICT (email) DO NOTHING;

INSERT INTO qr_codes (code, location) VALUES
('QR001', 'Oficina Principal'),
('QR002', 'Almacén')
ON CONFLICT (code) DO NOTHING;

-- Mensaje de finalización
DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos de fichaje creada exitosamente!';
    RAISE NOTICE '👥 Total de usuarios: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE '📱 Total de códigos QR: %', (SELECT COUNT(*) FROM qr_codes);
END $$;