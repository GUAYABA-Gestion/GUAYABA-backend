// CORRER ESTO SOLO UNA VEZ, CON "node dbSetup.js" 

import { config } from 'dotenv';
import * as api from './api.js';

config();

api.initializeDB();

const query = `
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
    datos_nuevos JSONB
);

-- Eliminar función de auditoría si ya existe
DROP FUNCTION IF EXISTS guayaba.fn_auditoria();

-- Crear función de auditoría
CREATE OR REPLACE FUNCTION guayaba.fn_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO guayaba.Auditoria (
        tabla_afectada,
        operacion,
        fecha_hora,
        datos_anteriores,
        datos_nuevos
    )
    VALUES (
        TG_TABLE_NAME,             -- Nombre de la tabla afectada
        TG_OP,                     -- Operación (INSERT, UPDATE, DELETE)
        CURRENT_TIMESTAMP,         -- Timestamp actual
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END, -- Datos anteriores
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END  -- Datos nuevos
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

`;

// const res = await api.query(query);
// console.log(res);

api.query(query);
