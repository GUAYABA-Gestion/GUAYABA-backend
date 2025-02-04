import { query } from "../utils/dbUtils.js"; // Importar la función query

const setupQuery = `
-- Crear esquema
CREATE SCHEMA IF NOT EXISTS guayaba;

-- Iniciar transacción
BEGIN;

-- Tabla Departamento
CREATE TABLE guayaba.Departamento (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla Municipio
CREATE TABLE guayaba.Municipio (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    departamento_id INTEGER NOT NULL,
    FOREIGN KEY (departamento_id) REFERENCES guayaba.Departamento(id)
);

-- Índice para búsqueda por nombre de municipio
CREATE INDEX idx_municipio_nombre ON guayaba.Municipio(nombre);

-- Tabla Persona 
CREATE TABLE guayaba.Persona (
    id_persona SERIAL PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(15),
    rol VARCHAR(50) NOT NULL,
    detalles VARCHAR(255)
);

-- Índices para Persona
CREATE INDEX idx_persona_nombre ON guayaba.Persona(nombre);
CREATE INDEX idx_persona_correo ON guayaba.Persona(correo);

-- Tabla Sede
CREATE TABLE guayaba.Sede (
    id_sede SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    municipio INTEGER NOT NULL,
    coordinador INTEGER NOT NULL,
    FOREIGN KEY (municipio) REFERENCES guayaba.Municipio(id),
    FOREIGN KEY (coordinador) REFERENCES guayaba.Persona(id_persona)
);

ALTER TABLE guayaba.Persona
ADD COLUMN id_sede INTEGER,
ADD CONSTRAINT fk_persona_sede
FOREIGN KEY (id_sede) REFERENCES guayaba.Sede(id_sede);

-- Tabla Edificio
CREATE TABLE guayaba.Edificio (
    id_edificio SERIAL PRIMARY KEY,
    id_sede INTEGER NOT NULL,
    id_titular INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    dirección VARCHAR(150),
    categoría VARCHAR(50),
    propiedad VARCHAR(50),
    area_terreno INTEGER CHECK (area_terreno > 0),
    area_construida INTEGER CHECK (area_construida > 0),
    cert_uso_suelo BOOLEAN NOT NULL,
    FOREIGN KEY (id_sede) REFERENCES guayaba.Sede(id_sede),
    FOREIGN KEY (id_titular) REFERENCES guayaba.Persona(id_persona)
);

-- Tabla Espacio
CREATE TABLE guayaba.Espacio (
    id_espacio SERIAL PRIMARY KEY,
    id_edificio INTEGER NOT NULL,
    nombre VARCHAR(100),
    estado VARCHAR(50),
    clasificacion VARCHAR(50),
    uso VARCHAR(50),
    tipo VARCHAR(50),
    piso VARCHAR(20),
    capacidad SMALLINT CHECK (capacidad > 0),
    mediciónmt2 INTEGER CHECK (mediciónmt2 > 0),
    FOREIGN KEY (id_edificio) REFERENCES guayaba.Edificio(id_edificio)
);

-- Tabla Facultad
CREATE TABLE guayaba.Facultad (
    id_facultad SERIAL PRIMARY KEY, 
    nombre TEXT NOT NULL UNIQUE
);

-- Tabla Programa
CREATE TABLE guayaba.Programa (
    id_programa SERIAL PRIMARY KEY, 
    id_facultad INTEGER NOT NULL,   
    nombre VARCHAR(50),         
    nivel VARCHAR(20),
    FOREIGN KEY (id_facultad) REFERENCES guayaba.Facultad(id_facultad)
);

-- Índice para búsqueda por estado de espacio
CREATE INDEX idx_espacio_estado ON guayaba.Espacio(estado);

-- Tabla Evento
CREATE TABLE guayaba.Evento (
    id_evento SERIAL PRIMARY KEY,
    id_espacio INTEGER NOT NULL,
    tipo VARCHAR(20),
    nombre VARCHAR(255), 
    descripción VARCHAR(255),
    id_programa INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    días VARCHAR(7),
    FOREIGN KEY (id_espacio) REFERENCES guayaba.Espacio(id_espacio),
    FOREIGN KEY (id_programa) REFERENCES guayaba.Programa(id_programa)  
);

-- Tabla Mantenimiento
CREATE TABLE guayaba.Mantenimiento (
    id SERIAL PRIMARY KEY,
    id_espacio INTEGER NOT NULL,
    id_encargado INTEGER NOT NULL,
    tipo_contrato VARCHAR(20),
    tipo VARCHAR(20),
    estado VARCHAR(20),
    necesidad VARCHAR(50),
    prioridad VARCHAR(20),
    detalle VARCHAR(50),
    fecha_ini TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP,
    observación TEXT,
    FOREIGN KEY (id_espacio) REFERENCES guayaba.Espacio(id_espacio),
    FOREIGN KEY (id_encargado) REFERENCES guayaba.Persona(id_persona)
);

-- Índice para búsqueda por prioridad en mantenimiento
CREATE INDEX idx_mantenimiento_prioridad ON guayaba.Mantenimiento(prioridad);

-- Fin de la transacción
COMMIT;

`;

const initializeDB = async () => {
  try {
    console.log("Inicializando la base de datos...");
    await query(setupQuery);
    console.log("Base de datos inicializada correctamente.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
};

initializeDB();
