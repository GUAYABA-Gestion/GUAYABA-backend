BEGIN;

INSERT INTO guayaba.Edificio (
    nombre,
    direccion,
    categoria,
    propiedad,
    area_terreno,
    area_construida,
    cert_uso_suelo,
    id_sede,
    id_titular
) VALUES
    -- Sede 1: Bogotá
    ('Edificio Central', 'Cra 1 #10-20', 'Principal', 'Propio', 5000, 3500, TRUE, 1, NULL),
    ('Bloque A', 'Cra 1 #10-30', 'Cat', 'Arrendado', 2000, 1500, TRUE, 1, NULL),
    ('Bloque B', 'Cra 1 #10-40', 'Cat', 'Propio', 1800, 1200, FALSE, 1, NULL),
    ('Edificio Administrativo', 'Cra 1 #10-50', 'Sede', 'Propio', 2500, 2000, TRUE, 1, NULL),
    ('Edificio de Laboratorios', 'Cra 1 #10-60', 'Sede y cat', 'Propio', 3000, 2200, TRUE, 1, NULL),
    -- Sede 2: Cali
    ('Edificio Principal', 'Calle 5 #20-10', 'Principal', 'Propio', 4000, 3000, TRUE, 2, NULL),
    ('Bloque Norte', 'Calle 5 #20-20', 'Cat', 'Arrendado', 1700, 1200, FALSE, 2, NULL),
    ('Bloque Sur', 'Calle 5 #20-30', 'Cat', 'Propio', 1600, 1100, TRUE, 2, NULL),
    ('Edificio de Aulas', 'Calle 5 #20-40', 'Sede', 'Propio', 2200, 1800, TRUE, 2, NULL),
    ('Edificio de Servicios', 'Calle 5 #20-50', 'Sede y cat', 'Arrendado', 2100, 1700, FALSE, 2, NULL),
    -- Sede 3: Pasto
    ('Edificio Académico', 'Av 3 #15-10', 'Principal', 'Propio', 3500, 2500, TRUE, 3, NULL),
    ('Bloque C', 'Av 3 #15-20', 'Cat', 'Arrendado', 1400, 1000, FALSE, 3, NULL),
    ('Bloque D', 'Av 3 #15-30', 'Cat', 'Propio', 1300, 900, TRUE, 3, NULL),
    ('Edificio de Investigación', 'Av 3 #15-40', 'Sede', 'Propio', 2000, 1600, TRUE, 3, NULL),
    ('Edificio de Extensión', 'Av 3 #15-50', 'Sede y cat', 'Propio', 2100, 1700, TRUE, 3, NULL),
    -- Sede 4: Puerto Colombia
    ('Edificio Costero', 'Carrera 7 #30-10', 'Principal', 'Propio', 3200, 2300, TRUE, 4, NULL),
    ('Bloque Mar', 'Carrera 7 #30-20', 'Cat', 'Arrendado', 1200, 800, FALSE, 4, NULL),
    ('Bloque Arena', 'Carrera 7 #30-30', 'Cat', 'Propio', 1100, 700, TRUE, 4, NULL),
    ('Edificio de Bienestar', 'Carrera 7 #30-40', 'Sede', 'Propio', 1800, 1400, TRUE, 4, NULL),
    ('Edificio de Servicios Generales', 'Carrera 7 #30-50', 'Sede y cat', 'Arrendado', 1600, 1200, FALSE, 4, NULL),
    -- Sede 5: Sabaneta
    ('Edificio Sabana', 'Transv 8 #40-10', 'Principal', 'Propio', 2800, 2000, TRUE, 5, NULL),
    ('Bloque E', 'Transv 8 #40-20', 'Cat', 'Arrendado', 1000, 700, FALSE, 5, NULL),
    ('Bloque F', 'Transv 8 #40-30', 'Cat', 'Propio', 900, 600, TRUE, 5, NULL),
    ('Edificio de Docencia', 'Transv 8 #40-40', 'Sede', 'Propio', 1500, 1200, TRUE, 5, NULL),
    ('Edificio de Apoyo', 'Transv 8 #40-50', 'Sede y cat', 'Propio', 1300, 1000, TRUE, 5, NULL);

COMMIT;
