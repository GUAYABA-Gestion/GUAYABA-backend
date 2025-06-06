BEGIN;

INSERT INTO guayaba.Facultad (nombre) VALUES
    ('Facultad de Medicina Veterinaria y Zootecnia'),
    ('Facultad de Ciencias Sociales y Administrativas'),
    ('Facultad de Ciencias de la Salud');

-- Facultad de Medicina Veterinaria y Zootecnia
INSERT INTO guayaba.Programa (id_facultad, nombre, nivel) VALUES
    (1, 'Especialización de Cirugía en Tejidos Blandos de Pequeños Animales', 'Posgrado'),
    (1, 'Especialización en Medicina de Fauna Silvestre', 'Posgrado'),
    (1, 'Especialización en Medicina Interna', 'Posgrado'),
    (1, 'Especialización en Producción Animal', 'Posgrado'),
    (1, 'Medicina Veterinaria y Zootecnia', 'Pregrado');

-- Facultad de Ciencias Sociales y Administrativas
INSERT INTO guayaba.Programa (id_facultad, nombre, nivel) VALUES
    (2, 'Administración de Empresas', 'Pregrado'),
    (2, 'Contaduría Pública', 'Pregrado'),
    (2, 'Derecho', 'Pregrado'),
    (2, 'Negocios Internacionales', 'Pregrado'),
    (2, 'Publicidad y Mercadeo', 'Pregrado');

-- Facultad de Ciencias de la Salud
INSERT INTO guayaba.Programa (id_facultad, nombre, nivel) VALUES
    (3, 'Medicina', 'Pregrado'),
    (3, 'Odontología', 'Pregrado'),
    (3, 'Optometría', 'Pregrado'),
    (3, 'Psicología', 'Pregrado');

COMMIT;