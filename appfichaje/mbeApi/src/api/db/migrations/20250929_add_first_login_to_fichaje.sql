-- Agrega la marca de primer login diario al fichaje de oficina
ALTER TABLE tbl_fichaje_oficina
    ADD COLUMN IF NOT EXISTS first_login TIMESTAMP WITHOUT TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_tbl_fichaje_oficina_first_login
    ON tbl_fichaje_oficina (fecha, idusuario);
