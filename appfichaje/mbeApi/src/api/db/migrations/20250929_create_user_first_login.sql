-- Tabla para registrar la primera vez que un usuario accede al ERP
CREATE TABLE IF NOT EXISTS tbl_usuario_first_login (
    id SERIAL PRIMARY KEY,
    idusuario BIGINT NOT NULL REFERENCES tbl_usuario(id),
    first_login_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_login_ip VARCHAR(64),
    first_login_user_agent TEXT,
    source VARCHAR(100),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tbl_usuario_first_login_user
    ON tbl_usuario_first_login (idusuario);
