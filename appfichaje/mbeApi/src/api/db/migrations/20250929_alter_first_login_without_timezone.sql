-- Ajusta las columnas de primer login para que no usen zona horaria
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'tbl_fichaje_oficina'
            AND column_name = 'first_login'
            AND data_type = 'timestamp with time zone'
    ) THEN
        EXECUTE $$ALTER TABLE public.tbl_fichaje_oficina
                ALTER COLUMN first_login
                TYPE TIMESTAMP WITHOUT TIME ZONE
                USING first_login AT TIME ZONE 'Europe/Madrid'$$;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'tbl_usuario_first_login'
            AND column_name = 'first_login_at'
            AND data_type = 'timestamp with time zone'
    ) THEN
        EXECUTE $$ALTER TABLE public.tbl_usuario_first_login
                ALTER COLUMN first_login_at
                TYPE TIMESTAMP WITHOUT TIME ZONE
                USING first_login_at AT TIME ZONE 'Europe/Madrid'$$;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
            AND table_name = 'tbl_usuario_first_login'
            AND column_name = 'created_at'
            AND data_type = 'timestamp with time zone'
    ) THEN
        EXECUTE $$ALTER TABLE public.tbl_usuario_first_login
                ALTER COLUMN created_at
                TYPE TIMESTAMP WITHOUT TIME ZONE
                USING created_at AT TIME ZONE 'Europe/Madrid'$$;
    END IF;
END $$;
