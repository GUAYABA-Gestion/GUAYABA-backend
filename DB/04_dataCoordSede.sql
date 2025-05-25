BEGIN;

-- 1. Insertar las sedes SIN coordinador
INSERT INTO guayaba.Sede ("nombre", "municipio", "coordinador")
VALUES
    ('Sede Bogotá', '11001', NULL),
    ('Sede Cali', '76001', NULL),
    ('Sede Pasto', '52001', NULL),
    ('Sede Puerto Colombia', '94884', NULL),
    ('Sede Sabaneta', '5631', NULL);

-- 2. Insertar los coordinadores, ya con id_sede correcto
INSERT INTO guayaba.Persona (
    "nombre",
    "correo",
    "telefono",
    "rol",
    "detalles",
    "es_manual",
    "id_sede"
) VALUES
    ('Coord. Bogotá',    'coordinadorSede1@sanmartin.edu.co', '3111111111', 'coordinador', 'Coordinador sede 1', TRUE, 1),
    ('Coord. Cali',      'coordinadorSede2@sanmartin.edu.co', '3112222222', 'coordinador', 'Coordinador sede 2', TRUE, 2),
    ('Coord. Pasto',     'coordinadorSede3@sanmartin.edu.co', '3113333333', 'coordinador', 'Coordinador sede 3', TRUE, 3),
    ('Coord. P-Colombia','coordinadorSede4@sanmartin.edu.co', '3114444444', 'coordinador', 'Coordinador sede 4', TRUE, 4),
    ('Coord. Sabaneta',  'coordinadorSede5@sanmartin.edu.co', '3115555555', 'coordinador', 'Coordinador sede 5', TRUE, 5);

-- 3. Actualizar las sedes para asignar el coordinador (usando el id_persona de cada uno)
UPDATE guayaba.Sede SET coordinador = p.id_persona
FROM guayaba.Persona p
WHERE guayaba.Sede.id_sede = p.id_sede AND p.rol = 'coordinador';

COMMIT;