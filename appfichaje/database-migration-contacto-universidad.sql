-- Migration script to update tbl_contacto_universidad and tbl_historico_contactos_rrhh to match new interface structure
-- This script aligns database schema with IContactoUniversidad interface and FIELD_LABELS

-- ========================================
-- MIGRACIÓN TABLA tbl_contacto_universidad
-- ========================================

-- First, let's add the new columns that don't exist yet
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS nota_personal text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS historico text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS myd text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS ade text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS rrhh text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS aca text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS atic text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS estado_ofertas text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS clave character varying(100);
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS notas_ofertas text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS anexos text;
ALTER TABLE tbl_contacto_universidad ADD COLUMN IF NOT EXISTS convocatorias text;

-- Rename columns to match new interface
ALTER TABLE tbl_contacto_universidad RENAME COLUMN notas TO nota_personal_old;
ALTER TABLE tbl_contacto_universidad RENAME COLUMN contrasena_portal TO clave_old;
ALTER TABLE tbl_contacto_universidad RENAME COLUMN firma_convenio TO firma_convenio_fecha;

-- Copy data from old columns to new ones if needed
UPDATE tbl_contacto_universidad SET nota_personal = nota_personal_old WHERE nota_personal IS NULL AND nota_personal_old IS NOT NULL;
UPDATE tbl_contacto_universidad SET clave = clave_old WHERE clave IS NULL AND clave_old IS NOT NULL;

-- Drop old columns that don't exist in new interface
ALTER TABLE tbl_contacto_universidad DROP COLUMN IF EXISTS siguiente_paso;
ALTER TABLE tbl_contacto_universidad DROP COLUMN IF EXISTS departamento;
ALTER TABLE tbl_contacto_universidad DROP COLUMN IF EXISTS nota_personal_old;
ALTER TABLE tbl_contacto_universidad DROP COLUMN IF EXISTS clave_old;

-- ========================================
-- MIGRACIÓN TABLA tbl_historico_contactos_rrhh
-- ========================================

-- Add new columns for historico table
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS nota_personal text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS historico text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS ultima_actualizacion date;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS myd text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS ade text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS rrhh text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS aca text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS atic text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS estado_ofertas text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS clave text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS notas_ofertas text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS anexos text;
ALTER TABLE tbl_historico_contactos_rrhh ADD COLUMN IF NOT EXISTS convocatorias text;

-- Rename columns in historico table
ALTER TABLE tbl_historico_contactos_rrhh RENAME COLUMN contrasena_portal TO clave_old;

-- Copy data from old column to new one
UPDATE tbl_historico_contactos_rrhh SET clave = clave_old WHERE clave IS NULL AND clave_old IS NOT NULL;

-- Drop old columns that don't exist in new interface
ALTER TABLE tbl_historico_contactos_rrhh DROP COLUMN IF EXISTS siguiente_paso;
ALTER TABLE tbl_historico_contactos_rrhh DROP COLUMN IF EXISTS telefono2;
ALTER TABLE tbl_historico_contactos_rrhh DROP COLUMN IF EXISTS departamento;
ALTER TABLE tbl_historico_contactos_rrhh DROP COLUMN IF EXISTS clave_old;
ALTER TABLE tbl_historico_contactos_rrhh DROP COLUMN IF EXISTS firma_convenio_link;
ALTER TABLE tbl_historico_contactos_rrhh DROP COLUMN IF EXISTS vencimiento_convenio;
ALTER TABLE tbl_historico_contactos_rrhh DROP COLUMN IF EXISTS altas_social;

-- Update column types if needed to match interface
-- (All text fields are already text or varchar which is compatible)

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

-- Verify the final structure matches the interface:
-- Expected columns for tbl_contacto_universidad: id, universidad, tipo, puesto, nota_personal, nombre, apellido, telefono, email, historico,
-- ultima_llamada, ultima_actualizacion, myd, ade, rrhh, aca, atic, estado_ofertas, portal_web, usuario_portal,
-- clave, firma_convenio_fecha, notas_ofertas, anexos, convocatorias

-- Expected columns for tbl_historico_contactos_rrhh: same fields plus: usuario, fecha, notas, id_contacto, 
-- firma_convenio_link, vencimiento_convenio, altas_social

-- You can run these queries to verify all columns exist:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tbl_contacto_universidad' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tbl_historico_contactos_rrhh' ORDER BY ordinal_position;