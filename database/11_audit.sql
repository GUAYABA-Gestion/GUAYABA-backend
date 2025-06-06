BEGIN;

-- Eliminar triggers si ya existen
DROP TRIGGER IF EXISTS trg_auditoria_persona ON guayaba.Persona;
DROP TRIGGER IF EXISTS trg_auditoria_sede ON guayaba.Sede;
DROP TRIGGER IF EXISTS trg_auditoria_edificio ON guayaba.Edificio;
DROP TRIGGER IF EXISTS trg_auditoria_espacio ON guayaba.Espacio;
DROP TRIGGER IF EXISTS trg_auditoria_evento ON guayaba.Evento;
DROP TRIGGER IF EXISTS trg_auditoria_mantenimiento ON guayaba.Mantenimiento;

-- Eliminar tabla de auditoría si ya existe
DROP TABLE IF EXISTS guayaba.Auditoria CASCADE;

-- Crear tabla de auditoría
CREATE TABLE guayaba.Auditoria (
    id_auditoria SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(100) NOT NULL,
    operacion VARCHAR(10) NOT NULL CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    correo VARCHAR(255) -- Nueva columna para el correo de la persona
);

-- Eliminar función de auditoría si ya existe
DROP FUNCTION IF EXISTS guayaba.fn_auditoria();

-- Crear función de auditoría
CREATE OR REPLACE FUNCTION guayaba.fn_auditoria()
RETURNS TRIGGER AS $$
DECLARE
    v_correo VARCHAR(255);
BEGIN
    -- Obtener el correo de la sesión
    v_correo := current_setting('app.current_user_email', true);

    INSERT INTO guayaba.Auditoria (
        tabla_afectada,
        operacion,
        fecha_hora,
        datos_anteriores,
        datos_nuevos,
        correo
    )
    VALUES (
        TG_TABLE_NAME,             -- Nombre de la tabla afectada
        TG_OP,                     -- Operación (INSERT, UPDATE, DELETE)
        CURRENT_TIMESTAMP,         -- Timestamp actual (ya en la zona configurada desde el archivo 00-config.sql)
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END, -- Datos anteriores
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,  -- Datos nuevos
        v_correo                   -- Correo de la persona que realizó la operación
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers

CREATE TRIGGER trg_auditoria_persona
AFTER INSERT OR UPDATE OR DELETE
ON guayaba.Persona
FOR EACH ROW
EXECUTE FUNCTION guayaba.fn_auditoria();

CREATE TRIGGER trg_auditoria_sede
AFTER INSERT OR UPDATE OR DELETE
ON guayaba.Sede
FOR EACH ROW
EXECUTE FUNCTION guayaba.fn_auditoria();

CREATE TRIGGER trg_auditoria_edificio
AFTER INSERT OR UPDATE OR DELETE
ON guayaba.Edificio
FOR EACH ROW
EXECUTE FUNCTION guayaba.fn_auditoria();

CREATE TRIGGER trg_auditoria_espacio
AFTER INSERT OR UPDATE OR DELETE
ON guayaba.Espacio
FOR EACH ROW
EXECUTE FUNCTION guayaba.fn_auditoria();

CREATE TRIGGER trg_auditoria_evento
AFTER INSERT OR UPDATE OR DELETE
ON guayaba.Evento
FOR EACH ROW
EXECUTE FUNCTION guayaba.fn_auditoria();

CREATE TRIGGER trg_auditoria_mantenimiento
AFTER INSERT OR UPDATE OR DELETE
ON guayaba.Mantenimiento
FOR EACH ROW
EXECUTE FUNCTION guayaba.fn_auditoria();

COMMIT;