BEGIN;

-- Espacios para el Edificio 1 (Sede Bogotá)
-- Suponiendo que el edificio tiene 3 pisos y Campus, Sótano, Terraza como opciones adicionales

INSERT INTO guayaba.Espacio (
    id_edificio,
    nombre,
    estado,
    clasificacion,
    uso,
    tipo,
    piso,
    capacidad,
    medicionmt2
) VALUES
    -- Primer piso
    (1, 'Aula 101', 'En funcionamiento', 'Edificio/bloque', 'Académico', 'Aula/salón', 'Primer piso', 40, 60),
    (1, 'Laboratorio Química', 'En funcionamiento', 'Edificio/bloque', 'Investigación', 'Laboratorio', 'Primer piso', 25, 50),
    (1, 'Baño Hombres 1', 'En funcionamiento', 'Edificio/bloque', 'Área común', 'Baño hombres', 'Primer piso', 5, 15),
    (1, 'Oficina Coordinación', 'En funcionamiento', 'Edificio/bloque', 'Administrativo', 'Oficina', 'Primer piso', 6, 20),
    (1, 'Sala de Cómputo 1', 'En funcionamiento', 'Edificio/bloque', 'Académico', 'Sala de cómputo', 'Primer piso', 30, 40),

    -- Segundo piso
    (1, 'Aula 201', 'En funcionamiento', 'Edificio/bloque', 'Académico', 'Aula/salón', 'Segundo piso', 40, 60),
    (1, 'Laboratorio Simulación', 'En funcionamiento', 'Edificio/bloque', 'Docencia', 'Laboratorio simulación', 'Segundo piso', 20, 45),
    (1, 'Baño Mujeres 2', 'En funcionamiento', 'Edificio/bloque', 'Área común', 'Baño mujeres', 'Segundo piso', 5, 15),
    (1, 'Oficina Docentes', 'En funcionamiento', 'Edificio/bloque', 'Administrativo', 'Oficina', 'Segundo piso', 8, 25),
    (1, 'Sala de Tutores', 'En funcionamiento', 'Edificio/bloque', 'Académico', 'Sala de tutores', 'Segundo piso', 12, 20),

    -- Tercer piso
    (1, 'Aula 301', 'En funcionamiento', 'Edificio/bloque', 'Académico', 'Aula/salón', 'Tercer piso', 40, 60),
    (1, 'Laboratorio Biología', 'En funcionamiento', 'Edificio/bloque', 'Investigación', 'Laboratorio', 'Tercer piso', 18, 40),
    (1, 'Baño Mixto 3', 'En funcionamiento', 'Edificio/bloque', 'Área común', 'Baño mixto', 'Tercer piso', 4, 12),
    (1, 'Oficina Administración', 'En funcionamiento', 'Edificio/bloque', 'Administrativo', 'Oficina', 'Tercer piso', 5, 18),
    (1, 'Sala de Juegos', 'En funcionamiento', 'Edificio/bloque', 'Bienestar universitario', 'Salón de juegos', 'Tercer piso', 15, 30),

    -- Sótano
    (1, 'Bodega General', 'En funcionamiento', 'Edificio/bloque', 'Área común', 'Bodega', 'Sótano', 0, 50),
    (1, 'Unidad de Residuos', 'En funcionamiento', 'Unidad de almacenamiento de residuos', 'Área común', 'Otro (describa en observación)', 'Sótano', 0, 20),

    -- Terraza
    (1, 'Zona Deportiva', 'En funcionamiento', 'Zona deportiva', 'Bienestar universitario', 'Cancha de juegos', 'Terraza', 20, 100);

COMMIT;