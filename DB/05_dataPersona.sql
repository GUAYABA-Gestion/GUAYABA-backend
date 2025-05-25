BEGIN;


INSERT INTO
    guayaba.Persona (
        "nombre",
        "correo",
        "telefono",
        "rol",
        "detalles",
        "es_manual",
        "id_sede"
    )
VALUES
    -- 5 Admins
    ('Admin Uno', 'admin1@guayaba.com', '3000000001', 'admin', 'Administrador principal', true, 1),
    ('Admin Dos', 'admin2@guayaba.com', '3000000002', 'admin', 'Administrador secundario', true, 2),
    ('Admin Tres', 'admin3@guayaba.com', '3000000003', 'admin', 'Administrador de soporte', true, 3),
    ('Admin Cuatro', 'admin4@guayaba.com', '3000000004', 'admin', 'Administrador de pruebas', true, 4),
    ('Admin Cinco', 'admin5@guayaba.com', '3000000005', 'admin', 'Administrador invitado', true, 5),
    -- 10 Mantenimiento
    ('Mantenimiento Uno', 'mantenimiento1@guayaba.com', '3000000011', 'mantenimiento', 'Técnico de mantenimiento', true, 1),
    ('Mantenimiento Dos', 'mantenimiento2@guayaba.com', '3000000012', 'mantenimiento', 'Técnico de mantenimiento', true, 1),
    ('Mantenimiento Tres', 'mantenimiento3@guayaba.com', '3000000013', 'mantenimiento', 'Técnico de mantenimiento', true, 2),
    ('Mantenimiento Cuatro', 'mantenimiento4@guayaba.com', '3000000014', 'mantenimiento', 'Técnico de mantenimiento', true, 2),
    ('Mantenimiento Cinco', 'mantenimiento5@guayaba.com', '3000000015', 'mantenimiento', 'Técnico de mantenimiento', true, 3),
    ('Mantenimiento Seis', 'mantenimiento6@guayaba.com', '3000000016', 'mantenimiento', 'Técnico de mantenimiento', true, 3),
    ('Mantenimiento Siete', 'mantenimiento7@guayaba.com', '3000000017', 'mantenimiento', 'Técnico de mantenimiento', true, 4),
    ('Mantenimiento Ocho', 'mantenimiento8@guayaba.com', '3000000018', 'mantenimiento', 'Técnico de mantenimiento', true, 4),
    ('Mantenimiento Nueve', 'mantenimiento9@guayaba.com', '3000000019', 'mantenimiento', 'Técnico de mantenimiento', true, 5),
    ('Mantenimiento Diez', 'mantenimiento10@guayaba.com', '3000000020', 'mantenimiento', 'Técnico de mantenimiento', true, 5);

    -- 10 Usuarios normales
INSERT INTO
    guayaba.Persona (
        "nombre",
        "correo",
        "rol",
        "es_manual",
        "id_sede"
    )
VALUES
    ('Usuario Uno', 'usuario1@guayaba.com', 'usuario', true, 1),
    ('Usuario Dos', 'usuario2@guayaba.com', 'usuario', true, 1),
    ('Usuario Tres', 'usuario3@guayaba.com', 'usuario', true, 2),
    ('Usuario Cuatro', 'usuario4@guayaba.com', 'usuario', true, 2),
    ('Usuario Cinco', 'usuario5@guayaba.com', 'usuario', true, 3),
    ('Usuario Seis', 'usuario6@guayaba.com', 'usuario', true, 3),
    ('Usuario Siete', 'usuario7@guayaba.com', 'usuario', true, 4),
    ('Usuario Ocho', 'usuario8@guayaba.com', 'usuario', true, 4),
    ('Usuario Nueve', 'usuario9@guayaba.com', 'usuario', true, 5),
    ('Usuario Diez', 'usuario10@guayaba.com', 'usuario', true, 5);


COMMIT;